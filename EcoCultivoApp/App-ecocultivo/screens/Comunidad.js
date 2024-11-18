import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert, Modal, Button } from 'react-native';
import { db, auth, storage } from '../credenciales';
import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

const ComunidadScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal para editar
  const [newComment, setNewComment] = useState(''); // Nuevo comentario
  const [currentPostId, setCurrentPostId] = useState(null); // ID del post actual
  const [editPostContent, setEditPostContent] = useState(''); // Contenido editado

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'comunidadd'), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
      const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
      const username = userDoc.exists() ? userDoc.data().username : 'Usuario Desconocido';

      const newPostRef = await addDoc(postsRef, {
        contenido: newPostContent,
        fecha: new Date(),
        userId: auth.currentUser.uid,
        userName: username,
        comentarios: [],
        likes: [],
        likesCount: 0,
      });

      if (imageUri) {
        const imageUrl = await uploadImage(imageUri);
        await updateDoc(newPostRef, { imageurl: imageUrl });
      }

      setNewPostContent('');
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al crear el post');
    }
  };

  const handleEditPost = async () => {
    if (!editPostContent.trim()) {
      Alert.alert('Error', 'El contenido del post no puede estar vacío.');
      return;
    }
    try {
      const postRef = doc(db, 'comunidadd', currentPostId);
      await updateDoc(postRef, { contenido: editPostContent });
      Alert.alert('Éxito', 'Post editado correctamente');
      setModalVisible(false);
      setEditPostContent('');
      setCurrentPostId(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo editar el post');
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este post?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'comunidadd', postId));
              Alert.alert('Éxito', 'Post eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el post');
            }
          },
        },
      ]
    );
  };

  const timeAgo = (date) => {
    if (!date) return 'Fecha desconocida';
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
    try {
      const postRef = doc(db, 'comunidadd', postId);
      const post = posts.find((p) => p.id === postId);
      const userId = auth.currentUser.uid;

      const alreadyLiked = post.likes.some((like) => like.userId === userId);

      if (alreadyLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove({ userId }),
          likesCount: post.likesCount - 1,
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion({ userId }),
          likesCount: post.likesCount + 1,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al dar like');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío.');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
      const username = userDoc.exists() ? userDoc.data().username : 'Usuario Desconocido';

      const postRef = doc(db, 'comunidadd', postId);
      await updateDoc(postRef, {
        comentarios: arrayUnion({
          comentario: newComment,
          fecha: new Date(),
          userId: auth.currentUser.uid,
          username,
        }),
      });

      setNewComment('');
      setCurrentPostId(null);
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al agregar el comentario');
    }
  };

  const handleCommentToggle = (postId) => {
    if (currentPostId === postId) {
      setCurrentPostId(null);
    } else {
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

  const renderItem = ({ item }) => {
    const isPostOwner = item.userId === auth.currentUser.uid;

    return (
      <View style={styles.postContainer}>
        <Text style={styles.username}>{item.userName}</Text>
        <Text>{item.contenido}</Text>
        <Text style={styles.timeAgo}>{timeAgo(item.fecha)}</Text>
        {item.imageurl && <Image source={{ uri: item.imageurl }} style={styles.postImage} />}
        <View style={styles.likesContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
            <Ionicons
              name={item.likes.some((like) => like.userId === auth.currentUser.uid) ? 'heart' : 'heart-outline'}
              size={24}
              color="red"
            />
            <Text style={styles.likeCount}>{item.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCommentToggle(item.id)}>
            <Ionicons name="chatbubble-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>
        {isPostOwner && (
          <View style={styles.postActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditPostContent(item.contenido);
                setCurrentPostId(item.id);
                setModalVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.id} />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            value={editPostContent}
            onChangeText={setEditPostContent}
            placeholder="Editar contenido del post"
            style={styles.postInput}
          />
          <Button title="Guardar Cambios" onPress={handleEditPost} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <View style={styles.createPostContainer}>
        <TextInput
          placeholder="¿Algún tip que quieras compartir hoy?"
          value={newPostContent}
          onChangeText={setNewPostContent}
          style={styles.postInput}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonImage} onPress={pickImage}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
            <Text style={styles.buttonText}>Crear Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createPostContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  postInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonImage: {
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  postContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  username: {
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  commentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',

  },
  deleteButton: {
    marginLeft: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default ComunidadScreen;