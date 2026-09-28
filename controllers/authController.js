import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Passer à true en production (HTTPS)
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, 
};

export const homePage = (req, res) => {
  res.json({ message: 'Bienvenue sur Mern Todo React App' });
};

export const register = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    // 1. Vérification de la présence des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // 2. Vérification de l'existence de l'utilisateur
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    // 3. Hachage et création
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    console.log("--- TENTATIVE DE LOGIN ---");
    console.log("req.body reçu :", req.body);
    console.log("Email extrait :", email);

    const user = await User.findOne({ email });
    console.log("Utilisateur trouvé en BDD :", user ? "OUI" : "NON");

    if (!user) {
      console.log("Raison de l'échec : Email inconnu en BDD");
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Mot de passe valide :", isMatch ? "OUI" : "NON");

    if (!isMatch) {
      console.log("Raison de l'échec : Le mot de passe ne correspond pas au hash BDD");
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // ... suite du code (génération du token)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Déconnexion réussie.' });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Impossible de supprimer un admin.' });

    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Impossible de modifier un admin.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      req.params._id,
      { email, password: hashedPassword },
      { new: true }
    );

    res.json({ message: 'Utilisateur mis à jour.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { password, role } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role });

    res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};