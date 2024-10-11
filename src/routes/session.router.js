import Router from 'express';
import UserModel from '../model/user.model.js';
import {createHash, isValidPassword} from "../utils/utils.js";
import passport from 'passport';
import generateToken from "../utils/jsonwebtoken.js";

const router = Router();

//JWT Register
router.post('/register', async (req, res) => {
    const {first_name, last_name, email, age, password, cart, role} = req.body;

    try {
        const userValidation = await UserModel.findOne({email});

        if (userValidation) {
            return res.status(400).send('The user already exist');
        }

        const newUser = await UserModel.create({first_name, last_name, email, age, password, cart, role})
        const token = generateToken({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            cart: newUser.cart,
            role: newUser.role,
        });

        res.status(201).send({message: 'User created successfully',token});

    } catch (error) {
        return res.status(400).send({error: error.message});
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email});
        if (user) {
            if (!isValidPassword(password,user)) {
                return res.status(400).send('Invalid Credentials');
            } else {
                const token = generateToken({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                })
            }
        } else {
            return res.status(400).send('Invalid Credentials');
        }
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
})

router.get('/logout', async (req, res) => {
    if (req.session.login){
        req.session.destroy();
    }
    res.redirect('/login');
})

//Github
router.get('/github',passport.authenticate('github',{scope: ['user:email']}), async (req, res) => {

})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}), async (req, res) => {
    //Github strategy will return the user, then we will use it to set in the session object
    req.session.user = req.user;
    req.session.login = true;
    res.redirect('/profile');
})

//Google


export default router;