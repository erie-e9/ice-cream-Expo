import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import constants from '../config/constants'

const ClientSchema = new Schema({
    username:{ type: String, 
        unique: true},
    firstname: String,
    lastname: String,
    avatar: String,
    password: String,
    email: String

},{ timestamps: true });

ClientSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = this._hashPassword(this.password);
        return next();
    }
    return next();
})

ClientSchema.methods = {
    _hashPassword(password){
        return hashSync(password)
    },
    authenticateClient(password){
        return compareSync(password, this.password)
    },
    createToken(){
        return jwt.sign({
            _id: this._id
        },constants.jwt_secret
    )}
}

export default mongoose.model('Client', ClientSchema)
