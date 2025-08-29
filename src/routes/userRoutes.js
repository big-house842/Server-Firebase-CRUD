const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
} = require('../controllers/userController');

// validação dos dados do usuário
const validateUser = require('../middleware/validateUser');

// ROTAS
router.post('/register', createUser);
router.get('/request', getUsers);
router.get('/request/:id', getUserById);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', validateUser, updateUser);

module.exports = router;