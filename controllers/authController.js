import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {connectDB} from '../server.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    connectDB(); // Assurez-vous que la connexion à la base de données est établie
    console.log("Données reçues dans req.body :", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }
    
    const defaultPermissions = role === 'admin' 
    ? ['read:user', 'delete:user', 'read:todo', 'write:todo'] 
    : ['read:todo', 'write:todo'];
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User(
      { email, password: hashedPassword, role: 'user', permissions: defaultPermissions });
    await user.save();
   
    return res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, permissions: user.permissions || [] },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const logout = async (req, res) => {
  try {
    connectDB();
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({ message: 'Déconnexion réussie.' });
  } catch (err) {
    console.error('logout error:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la déconnexion.' });
  }
};

export const getMe = async (req, res) => {
  try {
    connectDB();
    const userId = req.user?.id ?? req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.json(user);
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    connectDB();
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erreur getAllUsers :', error);
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    connectDB();
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.role === 'admin') {
      return res
        .status(403)
        .json({ message: 'Impossible de supprimer un compte administrateur.' });
    }

    await user.deleteOne();
    return res
      .status(200)
      .json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur deleteUser :', error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};