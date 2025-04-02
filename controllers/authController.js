import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const secretKey = process.env.JWT_SECRET || 'super_secret_key';

// Inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { login, password, name, email } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      login,
      password: hashedPassword,
      name,
      email,
    });

    return res.status(201).json({ message: 'Utilisateur créé avec succès.', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants incorrects' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants incorrects' });
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '7d' });

    return res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer les informations de l'utilisateur connecté
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};
