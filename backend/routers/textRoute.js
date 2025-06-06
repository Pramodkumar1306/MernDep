import express from 'express'
import {testingNormal} from '../controller/testingRoutWork.js'
const testRoute = express.Router();

testRoute.get('/testing',testingNormal);

export default testRoute;