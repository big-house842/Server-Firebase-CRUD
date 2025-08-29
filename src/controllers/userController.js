const db = require('../config/firebaseConfig');

// Criar o usuário
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    const userRef = await db.collection('users').add({
      name,
      email,
      age: parseInt(age),
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      id: userRef.id, //Mostra o ID novo criada para o usuário
      message: 'Usuário criado com sucesso!' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Consultar todos os usuários
const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get(); // Retira os dados em formato SnapShot
    const users = [];
    
    usersSnapshot.forEach((doc) => { // Transforma em uma array com os dados da SnapShot
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consultar usuário pelo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Pega parâmetro da URL
    
    await db.collection('users').doc(id).delete();
    res.json({ message: 'Usuário deletado com sucesso!' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser
};