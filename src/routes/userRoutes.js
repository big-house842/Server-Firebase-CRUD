const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');

// ROTAS
router.post('/register', createUser);
router.get('/request', getUsers);
router.get('/request/:id', getUserById);
router.delete('/delete/:id', deleteUser);

module.exports = router;