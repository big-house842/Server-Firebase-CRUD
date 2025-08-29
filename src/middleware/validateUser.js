const validateUser = (req, res, next) => {
  const { nome, cpf, email } = req.body;
  
  console.log(' Validando dados:', req.body);
  
  // Validações básicas
  if (!nome || nome.trim().length < 2) {
    return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
  }
  
  if (!cpf || cpf.length !== 11) {
    return res.status(400).json({ error: 'CPF deve ter 11 dígitos' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  next(); // Se tudo ok, passa para o controller
};

module.exports = validateUser;