import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, 
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

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