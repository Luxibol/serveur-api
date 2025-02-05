const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const indexRouter = require('./routes/index');  
const dashboardRouter = require('./routes/dashboard');
const userRoutes = require("./routes/users"); 
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");

const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

// Configuration du moteur de vues
app.set("view engine", "ejs");
console.log(" EJS configuré avec succès !");
app.set("views", path.join(__dirname, "views"));

// Configuration de la session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour vérifier si l'utilisateur est connecté
const requireAuth = (req, res, next) => {
    if (!req.session.token) {
        console.log("🔴 Accès refusé : Token manquant !");
        return res.redirect("/");  // 🔄 Redirige vers la page d'accueil si pas de token
    }
    next();
};

// Charge la page d'accueil en premier
app.use("/", indexRouter);
app.use("/dashboard", dashboardRouter);
app.use("/users", userRoutes);
app.use("/catways", catwayRoutes);
app.use("/reservations", reservationRoutes);

// Middleware 404 (toujours en dernier)
app.use(function(req, res, next) {
    res.status(404).render('404', { title: 'Page non trouvée' });
});

module.exports = app;
