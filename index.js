import express from "express";
import {__dirname} from "./src/utility.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import './src/database/database.js';
import morgan from "morgan";
import 'dotenv/config';
import * as path from "node:path";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import {engine} from "express-handlebars";

import ViewsRouter from './src/routes/views.router.js';
import SessionRouter from './src/routes/session.router.js';


const app = express();
const port = process.env.PORT;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'login-app-db',
        ttl: 120 //In seconds
    })
}))

//Using Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//ViewEngine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Router
app.use('/', ViewsRouter);
app.use('/api/session', SessionRouter)


//Starting APP
app.listen(port, () => {
    console.log(`Server up on port ${port}`);
})

