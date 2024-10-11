//Bcrypt
import bcrypt from 'bcrypt';

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

const isValidPassword = (password, user) => {
    bcrypt.compareSync(password, bcrypt.genSaltSync(10), user.password);
}

export {createHash, isValidPassword};