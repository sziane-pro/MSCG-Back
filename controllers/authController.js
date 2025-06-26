import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const secretKey = process.env.JWT_SECRET || 'super_secret_key';

// Inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    // Validation des données requises selon le MPD
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ 
        message: 'Email, mot de passe, prénom et nom sont requis.' 
      });
    }

    // Validation des tailles selon le MPD
    if (firstname.length > 100) {
      return res.status(400).json({ 
        message: 'Le prénom ne peut pas dépasser 100 caractères.' 
      });
    }

    if (lastname.length > 100) {
      return res.status(400).json({ 
        message: 'Le nom ne peut pas dépasser 100 caractères.' 
      });
    }

    if (email.length > 255) {
      return res.status(400).json({ 
        message: 'L\'email ne peut pas dépasser 255 caractères.' 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      email: email.trim(),
      password: hashedPassword,
      firstname: firstname.trim(),
      lastname: lastname.trim()
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email }, 
      secretKey, 
      { expiresIn: '7d' }
    );

    return res.status(201).json({ 
      message: 'Utilisateur créé avec succès.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données requises
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

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
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      secretKey, 
      { expiresIn: '7d' }
    );

    return res.json({ 
      message: 'Connexion réussie', 
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
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

    return res.json({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Erreur profil utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
