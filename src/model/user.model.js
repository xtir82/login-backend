import {Schema, model} from "mongoose";

const userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number},
    password: {type: String},
    cart: {type: String},
    role: {type: String, default: 'user'},
})

const UserModel = model("users", userSchema);
export default UserModel;