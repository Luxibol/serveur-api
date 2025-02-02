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

exports.initClientDbConnection = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.URL_MONGO, clientOption);

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