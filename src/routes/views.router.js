import { Router } from 'express';

const router = Router();

router.get('/register', (req, res) => {
    if (req.session.login) {
        res.redirect('/profile');
    } else {
        res.render('register');
    }
})

router.get('/login', (req, res) => {
    if (req.session.login) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
})

router.get('/profile', (req, res) => {
    if (req.session.login) {
        res.redirect('/login');
    } else {
        res.render('profile');
    }
})

export default router;