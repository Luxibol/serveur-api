const express       = require('express');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const cors          = require('cors');

const indexRouter   = require('./routes/index');
const userRoutes    = require("./routes/users"); 
const catwayRoutes  = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");

const mongodb       = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

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

// Middleware 404
app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
