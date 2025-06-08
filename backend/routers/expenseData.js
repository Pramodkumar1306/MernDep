import express from 'express'
import {
    add,
    getAllExpenses,
    updateExpense,
    deleteExpense,
    createCollection,
    getCollections,
    renameCollection,
    deleteCol,
} from '../controller/dataController.js'

const expenseData = express.Router();


expenseData.post('/add',add);
expenseData.post('/createCollection',createCollection);
expenseData.get('/getCollections',getCollections);
expenseData.post('/getAllExpenses',getAllExpenses);
expenseData.put('/renameCollection',renameCollection);
expenseData.delete('/deleteCollection/:site',deleteCol);


expenseData.put('/update/:id', updateExpense);

// expenseData.put('/update/:id', updateExpense);
// OLD: this won't work because body is not read in DELETE
// expenseData.delete('/delete/:id', deleteExpense);

// ✅ NEW: include site in params
expenseData.delete('/delete/:site/:id', deleteExpense);


export default expenseData;