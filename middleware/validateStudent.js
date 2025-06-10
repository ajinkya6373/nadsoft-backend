// Validation middleware
export const validateStudent = (req, res, next) => {
    const { first_name, last_name, email, date_of_birth } = req.body;

    // Check for required fields
    if (!first_name || !last_name || !email || !date_of_birth) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Validate name lengths
    if (first_name.length < 2 || first_name.length > 50) {
        return res.status(400).json({ error: 'First name must be between 2 and 50 characters' });
    }
    if (last_name.length < 2 || last_name.length > 50) {
        return res.status(400).json({ error: 'Last name must be between 2 and 50 characters' });
    }

    next();
};

