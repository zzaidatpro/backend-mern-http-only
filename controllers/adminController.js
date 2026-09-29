import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Todo from '../models/Todo.js';

export const adminPage = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalTodos = await Todo.countDocuments({});

    res.json({
      message: 'Espace administrateur',
      stats: { totalUsers, totalTodos }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.params._id;
    const user = await User.findById(userId).select('-password');
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
    await User.create({ email, password: hashedPassword, role: role || 'user' });

    res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.params._id;
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Impossible de modifier un admin.' });

    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, updates, { new: true });

    res.json({ message: 'Utilisateur mis à jour.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.params._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Impossible de supprimer un admin.' });

    // Nettoyage en cascade : supprimer aussi les tâches de cet utilisateur
    await Todo.deleteMany({ userId });
    await user.deleteOne();

    res.json({ message: 'Utilisateur et ses tâches supprimés avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};