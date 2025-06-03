import express from 'express'
import {add,createCollection,getCollections,getAllExpenses} from '../controller/dataController.js'

const expenseData = express.Router();


expenseData.post('/add',add);
expenseData.post('/createCollection',createCollection);
expenseData.get('/getCollections',getCollections);
expenseData.post('/getAllExpenses',getAllExpenses);

export default expenseData;