const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Conexão DB
require('./config/firebaseConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Arquivos static da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da api
app.use('/api', require('./routes/userRoutes'));

// Rota padrão no front-end
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Frontend: http://localhost:${PORT}`);
  console.log(` API: http://localhost:${PORT}/api/request`);
});