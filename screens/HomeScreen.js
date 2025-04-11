import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'entries'),
      where('uid', '==', auth.currentUser.uid), // ✅ filters by current user
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });

    return () => unsubscribe(); // clean up
  }, []);

  const renderItem = ({ item }) => (

    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ViewEntry', { entry: item })}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.thumbnail} />
      )}
      <Text style={styles.text}>
        {item.text.length > 60 ? item.text.slice(0, 60) + '...' : item.text}
      </Text>
    </TouchableOpacity>

  );
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out ✅');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  return (
    
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
  <Text style={styles.logoutText}>Log Out</Text>
</TouchableOpacity>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 8 }}
      />
      <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('WriteEntry')}
      >
     <Text style={styles.fabIcon}>+</Text>
     </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1 / 3,
    margin: 4,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  fabIcon: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  logoutBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    margin: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});

