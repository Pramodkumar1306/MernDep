import express from 'express';
import cors from 'cors';
import connectDb from './config/mongodb.js';
import expenseData from './routers/expenseData.js';
import testRoute from './routers/textRoute.js'
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
connectDb();

// API Endpoints
app.use('/api/expenses', expenseData);
app.use('/api/test', testRoute);
// app.use('/images', express.static('uploads'))

app.get('/', (req, res) => {
    res.send("Api Working");
    console.log("working");
})

app.listen(PORT,() => {console.log(PORT)});
