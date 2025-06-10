import express from 'express';
import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} from '../controllers/studentsController.js';
import { validateStudent } from '../middleware/validateStudent.js';

const router = express.Router();

router.post('/createStudent', validateStudent, createStudent);
router.get('/getAll', getStudents);
router.get('/:id', getStudentById);
router.put('/update/:id', validateStudent, updateStudent);
router.delete('/delete/:id', deleteStudent);

export default router;
