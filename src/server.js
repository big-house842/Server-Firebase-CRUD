const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa a configuração do Firebase
require('./config/firebaseConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Não tem autentificação
app.use(cors());
app.use(express.json());

// Adiciona api antes da rota
app.use('/api', require('./routes/userRoutes'));

// Rota padrão(default)
app.get('/', (req, res) => {
  res.json({ message: 'API com Firebase funcionando! ' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});