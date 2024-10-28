import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth, storage } from '../credenciales';
import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, getDoc, } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

const ComunidadScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [newComment, setNewComment] = useState(''); // Estado para el nuevo comentario
  const [currentPostId, setCurrentPostId] = useState(null); // Estado para el ID del post actual

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'comunidadd'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setPosts(postsData);
    });
    return unsubscribe;
  }, []);

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const storageRef = ref(storage, `comunidadd/${auth.currentUser.uid}/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
        Alert.alert('Error', 'El contenido del post no puede estar vacío.');
        return;
    }

    const postsRef = collection(db, 'comunidadd');

    try {
        // Obtener el documento del usuario para obtener el username
        const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        const username = userDoc.exists() ? userDoc.data().username : 'Usuario Desconocido'; // Usa un valor por defecto si no existe

        const newPostRef = await addDoc(postsRef, {
            contenido: newPostContent,
            fecha: new Date(),
            userId: auth.currentUser.uid,
            userName: username,
            comentarios: [],
            likes: [], // Inicializar likes como array vacío
            likesCount: 0 // Inicializar likesCount en 0
        });

        if (imageUri) {
            const imageUrl = await uploadImage(imageUri);
            await updateDoc(newPostRef, { imageurl: imageUrl });
        }

        console.log('Post creado con ID:', newPostRef.id);
        setNewPostContent(''); // Limpiar el campo de texto del post
    } catch (error) {
        console.error('Error al crear el post', error);
        Alert.alert('Error', 'Hubo un error al crear el post');
    }
    };

    const timeAgo = (date) => {
        if (!date) return 'Fecha desconocida'; // Manejar el caso de fecha no definida
        const now = new Date();
        const seconds = Math.floor((now - date.toDate()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        
        if (interval >= 1) return `${interval} año${interval === 1 ? '' : 's'} atrás`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} mes${interval === 1 ? '' : 'es'} atrás`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} día${interval === 1 ? '' : 's'} atrás`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hora${interval === 1 ? '' : 's'} atrás`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minuto${interval === 1 ? '' : 's'} atrás`;
        
        return 'Ahora mismo';
      };

  const handleLike = async (postId) => {
    try{
        const postRef = doc(db, 'comunidadd', postId);
        const post = posts.find((p) => p.id === postId);
        const userId = auth.currentUser.uid;
        // Crea una función para obtener el nombre de usuario si aún no lo tienes
        const userDoc = await getDoc(doc(db, 'usuarios', userId)); // Asegúrate de que el ID del usuario sea el correcto.
        const username = userDoc.exists() ? userDoc.data().username : null; // Asegúrate de que 'username' sea el campo correcto.

        if (username) {
            if (post.likes.some(like => like.username === username)) {
                await updateDoc(postRef, {
                    likes: arrayRemove({ username}), // Elimina el objeto de like
                    likesCount: post.likesCount - 1
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion({ username}), // Agrega el objeto de like
                    likesCount: post.likesCount + 1
                });
            }
        } else {
            Alert.alert('Error', 'No se encontró el nombre de usuario.');
        }
    } catch (error) {
        console.error('Error al dar like', error);
        Alert.alert('Error', 'Hubo un error al dar like');
    }
  };

  const handleAddComment = async (postId) => {
    // Obtener el documento del usuario
    const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
    const username = userDoc.exists() ? userDoc.data().username : 'Usuario Desconocido'; // Nombre de usuario por defecto

    // Verificar que el nuevo comentario no esté vacío
    if (!newComment.trim()) {
        Alert.alert('Error', 'El comentario no puede estar vacío.');
        return; // Salir si el comentario está vacío
    }

    try {
        const postRef = doc(db, 'comunidadd', postId);

        // Agregar el comentario a Firestore
        await updateDoc(postRef, {
            comentarios: arrayUnion({
                comentario: newComment,
                fecha: new Date(),
                userId: auth.currentUser.uid,
                username: username // Usa el nombre de usuario obtenido
            })
        });

        setNewComment(''); // Limpiar el campo de texto del comentario
        setCurrentPostId(null); // Restablecer el ID del post actual
    } catch (error) {
        console.error('Error al agregar comentario', error);
        Alert.alert('Error', 'Hubo un error al agregar comentario');
    }
};

  const handleCommentToggle = (postId) => {
    if (currentPostId === postId) {
      // Si el post actual es el mismo, ocultar el input
      setCurrentPostId(null);
    } else {
      // Mostrar el input del nuevo post
      setCurrentPostId(postId);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.uri);
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.postContainer}>
    <Text style={styles.username}>{item.userName}</Text>
    <Text>{item.contenido}</Text>
    <Text style={styles.timeAgo}>{timeAgo(item.fecha)}</Text>
    {item.imageurl && <Image source={{ uri: item.imageurl }} style={styles.postImage} />}
    <View style={styles.likesContainer}>
      <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
        <Ionicons name={item.likes.some(like => like.username === auth.currentUser.displayName) ? "heart" : "heart-outline"} size={24} color="red" />
        <Text style={styles.likeCount}>{item.likesCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleCommentToggle(item.id)}>
        <Ionicons name="chatbubble-outline" size={24} color="green" />
      </TouchableOpacity>
    </View>
    {currentPostId === item.id && (
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
        />
        <TouchableOpacity onPress={() => handleAddComment(item.id)}>
          <Ionicons name="paper-plane" size={24} color="green" />
        </TouchableOpacity>
      </View>
    )}
    <FlatList
      data={item.comentarios}
      renderItem={({ item: comment }) => (
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>{comment.username}</Text>
          <Text>{comment.comentario}</Text>
        </View>
      )}
      keyExtractor={(comment, index) => index.toString()}
    />
  </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidad Ecocultivo</Text>
      </View>
      <View>
        <View style={styles.createPostContainer}>
          <TextInput
            placeholder="¿Algún tip que quieras compartir hoy?"
            value={newPostContent}
            onChangeText={setNewPostContent}
            style={styles.postInput}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonImage} onPress={pickImage}>
                <Text style={styles.botonTexto}>Seleccionar Imagen</Text>
                {imageUri && (
                <>
                    <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    <TouchableOpacity onPress={() => setImageUri(null)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPublic} onPress={handleCreatePost}>
                <Text style={styles.botonTexto}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 40,
    backgroundColor: '#f0f8f0',
  },
  header: { 
    marginBottom: 20,
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#3b6e3a',
  },
  createPostContainer: {
    padding: 10,
    backgroundColor: '#e9f9e9',
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  postInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#3b6e3a',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 5,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeCount: {
    marginLeft: 5,
    color: '#3b6e3a',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  commentContainer: {
    marginLeft: 20,
    marginTop: 5,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#3b6e3a',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 15,
  },
  buttonPublic: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10, // Espacio entre los botones
    marginTop: 10,
    marginRight: 15,
  },
  botonTexto: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
});

export default ComunidadScreen;
