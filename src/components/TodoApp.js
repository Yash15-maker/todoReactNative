import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, Alert, View, TouchableOpacity, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, fetchTodos, deleteTodo, updateTodo } from '../redux/slices/todoSlice';
import { TextInput } from 'react-native-paper';

const CustomButton = ({ onPress, disabled, isLoading, children }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.customButton,
            disabled && styles.disabledButton
        ]}
    >
        {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
        ) : (
            <Text style={styles.customButtonText}>{children}</Text>
        )}
    </TouchableOpacity>
);

const TodoApp = () => {
    const [newTodo, setNewTodo] = useState('');
    const [currentTodoId, setCurrentTodoId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const todos = useSelector((state) => state.todo.todos);
    const status = useSelector((state) => state.todo.status);
    const error = useSelector((state) => state.todo.error);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    const handleAddOrUpdateTodo = async () => {
        if (newTodo.trim() === '') {
            Alert.alert('Error', 'Todo cannot be empty');
            return;
        }

        setIsLoading(true);
        try {
            if (currentTodoId) {
                await dispatch(updateTodo({ id: currentTodoId, name: newTodo })).unwrap();
                setCurrentTodoId(null);
            } else {
                await dispatch(addTodo({ name: newTodo })).unwrap();
            }
            setNewTodo('');
        } catch (error) {
            Alert.alert('Error', 'Failed to add/update todo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTodo = (item) => {
        setNewTodo(item.name);
        setCurrentTodoId(item.id);
    };

    const handleDeleteTodo = (docId) => {
        dispatch(deleteTodo(docId));
    };

    const renderTodoItem = ({ item }) => (
        <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.name}</Text>

            <View style={styles.todoButtons}>
                <TouchableOpacity style={styles.updateButton} onPress={() => handleEditTodo(item)}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTodo(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.paragraph}>Enter Your Todo:</Text>

            <TextInput
                label="Todo"
                value={newTodo}
                onChangeText={setNewTodo}
                mode="outlined"
                style={styles.input}
            />

            <CustomButton
                onPress={handleAddOrUpdateTodo}
                disabled={isLoading}
                isLoading={isLoading}
            >
                {currentTodoId ? "Update Todo" : "Add Todo"}
            </CustomButton>

            {status === 'loading' && <Text>Loading...</Text>}
            {status === 'failed' && <Text>Error: {error}</Text>}

            <ScrollView>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTodoItem}
                    style={styles.list}
                    scrollEnabled={false}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TodoApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 10
    },
    paragraph: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    input: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'white',
    },
    customButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    customButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        marginTop: 20,
    },
    todoItem: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 3,
    },
    todoText: {
        fontSize: 16,
        flex: 1,
    },
    todoButtons: {
        flexDirection: 'row',
    },
    updateButton: {
        backgroundColor: '#FF9800',
        padding: 5,
        borderRadius: 4,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 5,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
});