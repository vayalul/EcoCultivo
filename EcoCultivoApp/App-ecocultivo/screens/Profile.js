import React, { useState, useEffect} from 'react';
import { View, Text, Alert, Button, Image, TextInput, ActivityIndicator , TouchableOpacity , StyleSheet } from 'react-native';
import { auth, db , storage } from '../credenciales';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut, updateProfile } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {

    const [username, setUsername] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if(auth.currentUser) {
                setUsername(auth.currentUser);
                setEmail(auth.currentUser.email);

                const docRef = doc(db, 'usuarios', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()) {
                    const data = docSnap.data();
                    setUsername(data.username);
                    setNombre(data.nombre);
                } else {
                    console.log('No existe usuario');
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: username
            });
            Alert.alert('Éxito', 'Perfil actualizado correctamente'); 
        } catch (error) {
            console.error('Error al actualizar el perfil', error);
            Alert.alert('Error', 'Hubo un error al actualizar el perfil'); 
        }
    };

    const navigation = useNavigation();

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Éxito', 'Sesión cerrada correctamente');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            Alert.alert('Error', 'Hubo un error al cerrar sesión'); 
        }
    };

    const pickImage = async () => {
        // solicitar permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted') {
            Alert.alert('Permisos denegados');
            return;
        }

        //abrir galeria
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if(!result.cancelled) {
            uploadImage(result.uri);
        }
    };

    const uploadImage = async (uri) => {
        setImageUploading(true);
        try {
            const storage = getStorage();
            const responde = await fetch(uri);
            const blob = await responde.blob();
            const filename = 'users/${auth.currentUser.uid}/profile.jpg';
            const storageRef = ref(storage, filename);
            
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);

            await updateProfile(auth.currentUser, {
                photoURL: url
            });

            Alert.alert('Éxito', 'Foto de perfil subida correctamente');
        } catch (error) {
          console.error('Error al subir la foto de perfil', error);
          Alert.alert('Error', 'Hubo un error al subir la foto de perfil');
        } finally {
          setImageUploading(false);
        }
    };

    if(loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#128C7E" />
            </View>
        );
    }

    if(!username) {
        return (
            <View>
                <Text>No hay usuario logueado</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={pickImage}>
                {username.photoURL ? (
                    <Image source={{ uri: username.photoURL }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                )}
                {imageUploading && (
                    <ActivityIndicator
                    style={styles.imageOverlay}
                    size="small"
                    color="#0000ff"
                    />
                )}
                </TouchableOpacity>
                <TextInput style={styles.title}>Perfil de {nombre}</TextInput>
                <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={username}
                placeholder="Usuario"
                editable={false}
                />
                <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={email}
                editable={false}
                placeholder="Email"
                />
                <Button title="Actualizar Perfil" onPress={handleUpdateProfile} />
                <View style={{ marginTop: 20 }}>
                <Button title="Cerrar Sesión" color="red" onPress={handleLogOut} />
                </View>
            </View>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 35,
    left: 35,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default Profile; 