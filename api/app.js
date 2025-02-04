const express       = require('express');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');
const path          = require('path');
const session       = require('express-session');

const indexRouter   = require('./routes/index');
const userRoutes    = require("./routes/users"); 
const catwayRoutes  = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");

const mongodb       = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

// Configuration du moteur de vues
app.set("view engine", "ejs");
console.log("✅ EJS configuré avec succès !");
app.set("views", path.join(__dirname, "views"));

// Configuration de la session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettre `true` en production avec HTTPS
}));

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes API
app.use("/users", userRoutes); 
app.use("/catways", catwayRoutes);
app.use("/catways", reservationRoutes);
app.use("/", indexRouter);

// Route pour afficher la page d'accueil
app.get("/", (req, res) => {
    res.render("index", { user: req.session?.user || null, message: null });
});

// Route pour afficher la documentation
app.get("/docs", (req, res) => {
    res.render("docs"); // La page docs.ejs sera ajoutée ensuite
});

// Middleware 404
app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});



module.exports = app;
