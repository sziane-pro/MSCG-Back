import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'super_secret_key';

// Middleware pour vérifier le token JWT
export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
