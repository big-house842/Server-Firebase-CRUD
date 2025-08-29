// Middlewares
app.use(cors());
app.use(express.json());


const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


// SERVE ARQUIVOS ESTÁTICOS DA PASTA PUBLIC (FRONTEND)
app.use(express.static(path.join(__dirname, '../public')));


// Configurar event listeners
function setupEventListeners() {
    userForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
}