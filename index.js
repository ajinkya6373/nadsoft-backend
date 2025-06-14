import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/students.js';
import marksRoutes from './routes/marks.js';
import cors from "cors";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/marks', marksRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
