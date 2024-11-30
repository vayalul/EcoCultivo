import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Modal, Image, TouchableOpacity, StyleSheet, SafeAreaView, Button, Alert } from "react-native";
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../credenciales';
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const Seguimiento = ({ route }) => {
    const navigation = useNavigation();
    const [seguimientos, setSeguimientos] = useState([]); 
    const [selectedCultivo, setSelectedCultivo] = useState(null); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [nota, setNota] = useState(""); 
    const [image, setImage] = useState(""); 
    const [editMode, setEditMode] = useState(false); 
    const [editingId, setEditingId] = useState(null);
    const userId = auth.currentUser.uid; 


    useEffect(() => {
        const fetchSeguimientos = async () => {
            if (route.params?.cultivo) {
                const cultivoId = route.params.cultivo.id;
                const q = query(
                    collection(db, "seguimiento"),
                    where("userId", "==", userId),
                    where("idCultivo", "==", cultivoId)
                );
                const querySnapshot = await getDocs(q);
                const seguimientosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSeguimientos(seguimientosData);
            }
        };
    
        fetchSeguimientos();
    }, [route.params?.cultivo]);

    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    
    const saveSeguimiento = async () => {
        const fechaActual = new Date(); 

            const seguimientoData = {
                idCultivo: selectedCultivo?.id || route.params?.cultivo?.id, 
                nota,
                image,
                userId,
                fecha: Timestamp.fromDate(fechaActual),
            };

            try {
                await addDoc(collection(db, "seguimiento"), seguimientoData);
                setSeguimientos([...seguimientos, seguimientoData]);
                setNota("");
                setImage("");
                setModalVisible(false);
                Alert.alert("Seguimiento agregado con éxito.");
                console.log("Seguimiento agregado con éxito.");
            } catch (error) {
                Alert.alert("Error al agregar seguimiento: ", error);
                console.log("Error al agregar seguimiento: ", error);
            }
        };

    const confirmDeleteSeguimiento = (id) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar este seguimiento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => deleteSeguimiento(id),
                    style: "destructive"
                }
            ]
        );
    };

   
    const deleteSeguimiento = async (id) => {
        try {
            const seguimientoRef = doc(db, "seguimiento", id);
            await deleteDoc(seguimientoRef);
            setSeguimientos(seguimientos.filter(item => item.id !== id));
            Alert.alert("Seguimiento eliminado con éxito.");
            console.log("Seguimiento eliminado con éxito.");
        } catch (error) {
            Alert.alert("Error al eliminar seguimiento: ", error);
            console.log("Error al eliminar seguimiento: ", error);
        }
    };

    
    const editSeguimiento = async () => {
        const updatedData = {
            nota,
            image,
            fecha: Timestamp.fromDate(new Date()),
        };

        try {
            const seguimientoRef = doc(db, "seguimiento", editingId);
            await updateDoc(seguimientoRef, updatedData);
            setSeguimientos(seguimientos.map(item =>
                item.id === editingId ? { ...item, ...updatedData } : item
            ));
            setNota("");
            setImage("");
            setEditMode(false);
            setEditingId(null);
            setModalVisible(false);
            Alert.alert("Seguimiento actualizado con éxito.");
            console.log("Seguimiento actualizado con éxito.");
        } catch (error) {
            Alert.alert("Error al actualizar seguimiento: ", error);
            console.log("Error al actualizar seguimiento: ", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>🌱 Seguimiento de Cultivos 🌱</Text>
            </View>

            <FlatList
                data={seguimientos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.seguimientoItem}>
                        <Text style={styles.seguimientoText}>{item.nota}</Text>
                        {item.image && <Image source={{ uri: item.image }} style={styles.seguimientoImage} />}
                        <Text style={styles.fechaText}>
                            {item.fecha?.toDate().toLocaleDateString() || "Sin fecha"}
                        </Text>

                        {/* Botones de editar y eliminar */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => { setEditMode(true); setEditingId(item.id); setNota(item.nota); setImage(item.image); setModalVisible(true); }} style={styles.iconButton}>
                                <MaterialIcons name="edit" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDeleteSeguimiento(item.id)} style={styles.iconButton}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Agregar Seguimiento</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
        >
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seguimiento del Cultivo</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Escribe una nota..."
                            value={nota}
                            onChangeText={setNota}
                        />
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            <Text>Seleccionar Imagen</Text>
                        </TouchableOpacity>
                        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
                        <View style={styles.modalButtons}>
                            {editMode ? (
                                <TouchableOpacity style={styles.saveButton} onPress={editSeguimiento}>
                                    <Text style={styles.buttonText}>Actualizar</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.saveButton} onPress={saveSeguimiento}>
                                    <Text style={styles.buttonText}>Guardar</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
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
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 20,
        paddingTop: 30 
    },
    headerContainer: { marginBottom: 20 },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: "#388E3C" 
    },
    seguimientoItem: { 
        marginBottom: 16, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: "#66BB6A",
        backgroundColor: "#C8E6C9", 
        borderRadius: 8 
    },
    seguimientoText: { 
        fontSize: 16, 
        color: "#2E7D32", 
        marginBottom: 8 
    },
    seguimientoImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: "#66BB6A" 
    },
    fechaText: { fontSize: 12, color: "#558B2F" },
    addButton: { 
        backgroundColor: "#43A047", 
        padding: 15, 
        borderRadius: 8, 
        alignItems: "center", 
        marginTop: 20, 
        marginBottom: 10 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        position: 'absolute', 
        top: 10, 
        right: 10 
    },
    iconButton: { 
        marginLeft: 10 
    },
    addButtonText: { 
        color: "#fff", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    backButton: {
        backgroundColor: "#FF7043", 
        padding: 15, 
        borderRadius: 8, 
        alignItems: "center", 
        justifyContent: 'center',
        bottom: 5,
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    modalBackground: { 
        flex: 1, 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        justifyContent: "center", 
        alignItems: "center" 
    },
    modalContent: { 
        width: "90%", 
        backgroundColor: "#FFF", 
        borderRadius: 10, 
        padding: 20, 
        alignItems: "center" 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#4CAF50", 
        marginBottom: 20 
    },
    textInput: { 
        borderWidth: 1, 
        borderColor: "#81C784", 
        width: "100%", 
        padding: 10, 
        marginBottom: 20, 
        borderRadius: 8, 
        backgroundColor: "#F1F8E9" 
    },
    imagePicker: { 
        padding: 10, 
        backgroundColor: "#A5D6A7", 
        alignItems: "center", 
        marginBottom: 20, 
        borderRadius: 8 
    },
    previewImage: { width: 200, height: 200, marginBottom: 20 },
    modalButtons: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        width: "100%" 
    },
    saveButton: { 
        backgroundColor: "#43A047", 
        padding: 10, 
        borderRadius: 8, 
        flex: 1, 
        alignItems: "center", 
        marginRight: 10 
    },
    cancelButton: { 
        backgroundColor: "#E57373", 
        padding: 10, 
        borderRadius: 8, 
        flex: 1, 
        alignItems: "center",
    },
    buttonText: { 
        color: "#FFF", 
        fontSize: 16, 
        fontWeight: "bold" 
    },
});

export default Seguimiento;
