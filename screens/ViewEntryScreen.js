import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewEntryScreen({ route, navigation }) {
  const { entry } = route.params;

  const deleteEntry = async () => {
    console.log('📡 Deleting Firestore entry ID:', entry.id);

    try {
      await deleteDoc(doc(db, 'entries', entry.id));
      console.log('✅ Entry deleted');
      Alert.alert('Deleted', 'Your memory has been deleted.');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      Alert.alert('Error', 'Could not delete entry.');
    }
  };

  const handleDelete = () => {
    console.log('🧨 Delete button pressed');

    Alert.alert(
      'Delete Entry?',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('🗑️ User confirmed delete');
            deleteEntry();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.text}>{entry.text}</Text>
  
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
  
        {entry.images?.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    flexDirection:'column'
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    paddingTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  deleteBtn: {
    alignSelf: 'flex-start', // or center if preferred
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8, 
    marginBottom: 20, 
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },editBtn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});
