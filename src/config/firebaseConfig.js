const admin = require("firebase-admin");
const path = require("path");

// Caminho para o arquivo de credenciais
const serviceAccount = require("../../firebase-credenciais.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log(' Firebase conectado!');

module.exports = db;