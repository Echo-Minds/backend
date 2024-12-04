const jwt = require('jsonwebtoken');
const SECRET_KEY = 'EchoMinds';
const ALGORITHM = 'HS256';

exports.createAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    algorithm: ALGORITHM,
    expiresIn: '30m',
  });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
