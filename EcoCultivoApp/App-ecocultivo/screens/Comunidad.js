import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Comunidad = () => {
    const [posts, setPosts] = useState([
        { id: '1', username: 'Marc00s', content: '¡Hola a todos! Algun consejo para cultivar papas?.', timestamp: 'Hace 2 horas', comments: [] },
        { id: '2', username: 'Ric4rd0', content: 'Alguien tiene consejos para cuidar mi cultivo de tomate?', timestamp: 'Hace 1 día', comments: [] },
        { id: '3', username: 'MyFiurerJ0se', content: 'Saben si llovera en puente alto?', timestamp: 'Hace 3 días', comments: [] },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');

    const agregarPost = () => {
        if (newPostContent.trim()) {
            const nuevoPost = {
                id: (posts.length + 1).toString(),
                username: 'usuarioNuevo', // Aquí puedes usar el nombre de usuario actual
                content: newPostContent,
                timestamp: 'Ahora mismo', // Puedes agregar lógica para manejar las fechas
                comments: [],
            };
            setPosts([...posts, nuevoPost]);
            setNewPostContent(''); // Limpiar el campo de texto
            setModalVisible(false); // Cerrar el modal
        } else {
            alert('Por favor, ingresa un contenido para el post.');
        }
    };

    const agregarComentario = () => {
        if (commentText.trim() && selectedPost) {
            const updatedPosts = posts.map(post => {
                if (post.id === selectedPost.id) {
                    return {
                        ...post,
                        comments: [...post.comments, { text: commentText, username: 'usuarioNuevo' }], // Aquí puedes usar el nombre de usuario actual
                    };
                }
                return post;
            });
            setPosts(updatedPosts);
            setCommentText(''); // Limpiar el campo de texto del comentario
            setSelectedPost(null); // Limpiar el post seleccionado
        } else {
            alert('Por favor, ingresa un comentario.');
        }
    };

    const renderPost = ({ item }) => (
        <View style={styles.postContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <TouchableOpacity
                style={styles.commentButton}
                onPress={() => {
                    setSelectedPost(item); // Guarda el post seleccionado
                    setCommentText(''); // Limpia el campo de texto del comentario
                }}
            >
                <Text style={styles.commentButtonText}>Comentar</Text>
            </TouchableOpacity>
            {item.comments.length > 0 && (
                <View>
                    {item.comments.map((comment, index) => (
                        <Text key={index} style={styles.commentText}>
                            {comment.username}: {comment.text}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Comunidad</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.crearPostButton}>
                    <Text style={styles.crearPostButtonText}>Crear Post</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.feed}
            />

            {/* Modal para crear un post */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible} // Solo el modal de crear post
                onRequestClose={() => setModalVisible(false)} // Cerrar modal al presionar atrás
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Crear Post</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe tu post aquí"
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                            multiline={true}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={agregarPost} style={styles.botonAgregar}>
                                <Text style={styles.botonTexto}>Agregar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botonCancelar}>
                                <Text style={styles.botonTexto}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para agregar comentario */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedPost !== null} // Modal de comentarios
                onRequestClose={() => {
                    setSelectedPost(null); // Cerrar modal al presionar atrás
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Comentar en {selectedPost?.username}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe tu comentario aquí"
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline={true}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={agregarComentario} style={styles.botonAgregar}>
                                <Text style={styles.botonTexto}>Agregar Comentario</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.botonCancelar}>
                                <Text style={styles.botonTexto}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    crearPostButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    crearPostButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    feed: {
        paddingBottom: 20,
    },
    postContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 10,
    },
    commentButton: {
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    commentButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 12,
        color: 'blue',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botonAgregar: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    botonCancelar: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    botonTexto: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Comunidad;
