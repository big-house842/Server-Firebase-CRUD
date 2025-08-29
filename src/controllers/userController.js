const db = require('../config/firebaseConfig');

// Cria um novo usuário
const createUser = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    
    if (!nome || !cpf || !email) {
      return res.status(400).json({ error: 'Nome, CPF e email são obrigatórios' });
    }

    // CONVERSÃO CORRETA DO CAMPO ALUNO
    let studentValue;
    if (aluno === 'true' || aluno === true || aluno === 'sim') {
      studentValue = true;
    } else {
      studentValue = false;
    }

    const userRef = await db.collection('users').add({
      name: nome,
      cpf: cpf,
      phone: telefone || '',
      email: email,
      registration: matricula || '',
      student: studentValue, // ← USANDO O VALOR CORRETO
      school: escola || '',
      createdAt: new Date()
    });
    
    res.status(201).json({ id: userRef.id, message: 'Usuário criado!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Consulta de todos os usuários
const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consulta realizada pelo ID do usuário
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Altera as inforções do usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'Usuário não encontrado' });

    // CONVERSÃO CORRETA DO CAMPO ALUNO
    let studentValue;
    if (aluno === 'true' || aluno === true || aluno === 'sim') {
      studentValue = true;
    } else {
      studentValue = false;
    }

    await db.collection('users').doc(id).update({
      name: nome,
      cpf: cpf,
      phone: telefone || '',
      email: email,
      registration: matricula || '',
      student: studentValue, // ← USANDO O VALOR CORRETO
      school: escola || '',
      updatedAt: new Date()
    });
    
    res.json({ message: 'Usuário atualizado!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deleta o usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.json({ message: 'Usuário deletado!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser };