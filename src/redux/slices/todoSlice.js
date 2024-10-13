import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../Firebase';

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
    const querySnapshot = await getDocs(collection(db, 'todo'));
    let todosArray = [];
    querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
    });
    return todosArray;
});

export const addTodo = createAsyncThunk('todo/addTodo', async ({ name }) => {
    const docRef = await addDoc(collection(db, 'todo'), { name });
    return { id: docRef.id, name };
});


export const deleteTodo = createAsyncThunk('todo/deleteTodo', async (docId) => {
    await deleteDoc(doc(db, 'todo', docId));
    return docId;
});

const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        todos: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter((todo) => todo.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;
