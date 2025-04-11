import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db } from '../firebase';
import { auth } from '../firebase';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

export default function WriteEntryScreen({ route, navigation }) {
  const editing = route?.params?.editing || false;
  const entry = route?.params?.entry || null;

  const [text, setText] = useState(entry?.text || '');
  const [images, setImages] = useState(entry?.images || []);

  const pickImage = async () => {
    console.log('Button was pressed ✅');
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      setImages((prev) => [...prev, pickedUri]);
      console.log('Image URI set:', pickedUri);
    }
  };

  const handleSaveEntry = async () => {
    if (!text.trim() && images.length === 0) {
      Alert.alert("Can't save", 'Please write something or add an image.');
      return;
    }

    try {
      const uploadedImageUrls = [];

      for (const uri of images) {
        const data = new FormData();
        data.append('file', {
          uri: uri,
          type: 'image/jpeg',
          name: `journal_${uuid.v4()}.jpg`,
        });
        data.append('upload_preset', 'myhistorypreset');
        data.append('cloud_name', 'dw97vultl');

        const res = await fetch('https://api.cloudinary.com/v1_1/dw97vultl/image/upload', {
          method: 'POST',
          body: data,
        });

        const result = await res.json();
        console.log('Cloudinary upload result:', result);

        if (result.secure_url) {
          uploadedImageUrls.push(result.secure_url);
        } else {
          console.warn('No secure_url returned:', result);
        }
      }

      const cleanedUrls = uploadedImageUrls.filter((url) => typeof url === 'string' && url.length > 0);

      await addDoc(collection(db, 'entries'), {
        text: text || '',
        images: cleanedUrls,
        createdAt: Timestamp.now(),
        uid: auth.currentUser.uid,
      });

      Alert.alert('Saved!', 'Your journal entry has been saved.');
      setText('');
      setImages([]);
      navigation.goBack();
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  const handleUpdateEntry = async () => {
    try {
      const entryRef = doc(db, 'entries', entry.id);

      await updateDoc(entryRef, {
        text,
        images,
        updatedAt: Timestamp.now(),
      });

      Alert.alert('Updated!', 'Your memory has been updated.');
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Something went wrong while updating.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{editing ? 'Edit your memory ✏️' : 'Write your memory 📝'}</Text>

      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        multiline
        value={text}
        onChangeText={setText}
      />

      <Button title="Add Picture" onPress={pickImage} />

      {images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.imagePreview} />
      ))}

      <Button
        title={editing ? 'Update Entry' : 'Save Entry'}
        onPress={editing ? handleUpdateEntry : handleSaveEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 22,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    height: 250,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imagePreview: {
    marginTop: 20,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});
