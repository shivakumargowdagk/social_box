const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    Firstname: {
        type: String,
        required: [true, 'Please add a firstname']
    },
    Lastname: {
        type: String,
        required: [true, 'Please add a lastname']

    },
    Email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ],
        unique: true
    },
    Password: {
        type: String,
        required: [true, 'Please add a password']
    },
    Isactive: {
        type: Boolean,
        default: false
    },
    emailLoginToken: {
        type:String
    },
    IsLogin: {
        type:Boolean,
        default:false
    }
})
UserSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
});
UserSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.Password);
};
UserSchema.methods.getLoginJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })

};

module.exports = mongoose.model('User', UserSchema);