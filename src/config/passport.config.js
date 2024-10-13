import passport from "passport";
import UserModel from "../model/user.model.js";
import { createHash, isValidPassword} from "../utils/utils.js";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age, cart, role} = req.body;

        try {
            let user = await UserModel.findOne({email: email})
            if (!user) {
                return done(null, false);
            } else {
                let newUser = await UserModel.create({first_name, last_name, email, age, cart, role, password: createHash(password)});
                return done(null, newUser);
            }

        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        try {
            let user = await UserModel.findOne({email});
            if (!user) {
                return done(null, false);
            } else {
                if (!isValidPassword(password, user)) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id: id});
        done(null, user);
    })

    //Github Login Passport
    passport.use("github", new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile",profile); //Hacemos print para validar

        try {
            let user = await UserModel.findOne({email: profile._json.email});
            if (!user) {
                let name = profile._json.name.split(" ");
                console.log('uno')

                let newUser = await UserModel.create({
                    first_name: name[0],
                    last_name: name[1],
                    age: 0,
                    email: profile._json.email,
                    password: ''
                })
                done(null, newUser);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;