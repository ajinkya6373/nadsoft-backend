import pool from '../db.js';


export const createStudent = async (req, res) => {
    try {
        const { first_name, last_name, email, date_of_birth } = req.body;

        const existingStudent = await pool.query(
            'SELECT * FROM students WHERE email = $1',
            [email]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(400).json({ error: 'Student with this email already exists' });
        }

        const result = await pool.query(
            `INSERT INTO students (first_name, last_name, email, date_of_birth)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [first_name, last_name, email, date_of_birth]
        );

        res.status(201).json({
            message: 'Student created successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const getStudents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const students = await pool.query(
            `SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const countResult = await pool.query(`SELECT COUNT(*) FROM students`);
        const total = parseInt(countResult.rows[0].count);

        res.json({
            data: students.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
    const id = req.params.id;
    try {
        const studentResult = await pool.query(`SELECT * FROM students WHERE id = $1`, [id]);
        if (studentResult.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json({
            ...studentResult.rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, email, date_of_birth } = req.body;
    try {
        const result = await pool.query(
            `UPDATE students SET first_name=$1, last_name=$2, email=$3, date_of_birth=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
            [first_name, last_name, email, date_of_birth, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query(`DELETE FROM students WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
