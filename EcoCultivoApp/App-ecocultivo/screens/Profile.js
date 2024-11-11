import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button, Image, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../credenciales';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut, updateProfile } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [username, setUsername] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                setEmail(auth.currentUser.email);

                const docRef = doc(db, 'usuarios', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
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


    const navigation = useNavigation();

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            Alert.alert('Éxito', 'Sesión cerrada correctamente');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            Alert.alert('Error', 'Hubo un error al cerrar sesión');
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permisos denegados');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.cancelled) {
            uploadImage(result.uri);
        }
    };

    const uploadImage = async (uri) => {
        setImageUploading(true);
        try {
            const storage = getStorage();
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = `users/${auth.currentUser.uid}/profile.jpg`;
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#128C7E" />
            </View>
        );
    }

    if (!username) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>No hay usuario logueado</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    {auth.currentUser.photoURL ? (
                        <Image source={{ uri: auth.currentUser.photoURL }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={120} color="#ccc" />
                    )}
                    {imageUploading && <ActivityIndicator style={styles.imageOverlay} size="small" color="#0000ff" />}
                </TouchableOpacity>

                <Text style={styles.title}>Perfil de {nombre}</Text>

                <TextInput
                    style={styles.input}
                    value={username}
                    placeholder="Usuario"
                    editable={false}
                />

                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder="Email"
                    editable={false}
                />


                <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#128C7E',
        marginBottom: 10,
    },
    imageOverlay: {
        position: 'absolute',
        top: 35,
        left: 35,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#128C7E',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 18,
        color: '#f44336',
        fontWeight: 'bold',
    },
});

export default Profile;
