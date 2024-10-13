import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    return token;
}

export default generateToken;