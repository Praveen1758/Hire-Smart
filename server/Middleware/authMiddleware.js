const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'GOODBYE';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { id: decoded }; // Assuming the token contains the user ID directly
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
