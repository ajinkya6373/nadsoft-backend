import pool from '../db.js';

// Get all marks for a specific student
export const getStudentMarks = async (req, res) => {
    const { studentId } = req.params;

    try {
        // Check if the student exists
        const studentCheck = await pool.query(
            'SELECT id, first_name, last_name FROM students WHERE id = $1',
            [studentId]
        );

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }
        // Fetch marks joined with subject names
        const result = await pool.query(
            `SELECT 
         m.id AS mark_id,
         m.score,
         s.id AS subject_id,
         s.name AS subject_name
       FROM marks m
       JOIN subjects s ON m.subject_id = s.id
       WHERE m.student_id = $1
       ORDER BY s.name`,
            [studentId]
        );

        res.status(200).json({
            success: true,
            student: {
                id: studentCheck.rows[0].id,
                name: `${studentCheck.rows[0].first_name} ${studentCheck.rows[0].last_name}`,
            },
            marks: result.rows,
        });
    } catch (error) {
        console.error('Error fetching student marks:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student marks',
        });
    }
};

// Add or update marks for a student
export const addOrUpdateStudentMarksBulk = async (req, res) => {
    const { student_id, marks } = req.body;
    if (!student_id || !Array.isArray(marks)) {
        return res.status(400).json({ success: false, message: 'Student ID and marks are required' });
    }

    try {
        // Verify student exists
        const studentCheck = await pool.query('SELECT id FROM students WHERE id = $1', [student_id]);
        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        for (const mark of marks) {
            const { subject_id, score } = mark;

            // Validate subject_id and score
            if (!subject_id || typeof score !== 'number' || score < 0 || score > 100) {
                return res.status(400).json({ success: false, message: 'Invalid mark input' });
            }

            // Upsert logic: update if exists, else insert
            await pool.query(
                `INSERT INTO marks (student_id, subject_id, score)
         VALUES ($1, $2, $3)
         ON CONFLICT (student_id, subject_id)
         DO UPDATE SET score = EXCLUDED.score, updated_at = CURRENT_TIMESTAMP`,
                [student_id, subject_id, score]
            );
        }

        res.json({ success: true, message: 'Marks added/updated' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

