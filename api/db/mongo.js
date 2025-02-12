const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config(); // Charge les variables d'environnement

const clientOption = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Vérification de la variable d'environnement
const MONGO_URI = process.env.URL_MONGO;

console.log("🔍 Vérification : URL_MONGO =", MONGO_URI);

if (!MONGO_URI) {
    console.error("❌ ERREUR : La variable d'environnement URL_MONGO est indéfinie !");
    process.exit(1); // Stoppe l'application si la connexion est impossible
}

exports.initClientDbConnection = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGO_URI, clientOption);

    console.log("✅ Connected to MongoDB");

    // Vérification avec un ping
    const db = mongoose.connection.db;
    const pingResult = await db.admin().command({ ping: 1 });

    console.log("🔹 Réponse au ping :", pingResult);
  } catch (e) {
    console.error("❌ Error connecting to MongoDB:", e.stack);
    throw e;
  }
};
