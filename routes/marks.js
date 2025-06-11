import express from 'express';
import { getStudentMarks, addOrUpdateStudentMarksBulk } from '../controllers/marksController.js';

const router = express.Router();

router.get('/student/:studentId', getStudentMarks);

router.post('/addUpdateMarks', addOrUpdateStudentMarksBulk);


export default router; 