import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const todos = await Todo.find({});
      return res.json(todos);
    }

    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { text, category } = req.body;
    const userId = req.user.id || req.user._id;

    const newTodo = new Todo({
      text,
      category: category || 'Divers',
      userId
    });

    const savedTodo = await newTodo.save();
    return res.status(201).json(savedTodo);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { text, completed, category } = req.body;
    const userId = req.user.id || req.user._id;

    // Construire l'objet avec les champs fournis
    const updates = {};
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    if (category !== undefined) updates.category = category;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { returnDocument: 'after' } // Remplace { new: true } pour éliminer l'avertissement Mongoose
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }

    res.json(updatedTodo);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }

    return res.json({ message: 'Tâche supprimée.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};