const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var ExtUserSchema = new mongoose.Schema({
    googleID: String,
    name: {
        type: String,
        required: true
    },
    CollegeName: {
        type: String,
        required: true,
        default: ''
    },
    phno: {
        type: String,
        required: true,
        unique: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is invalid email'
        }
    },
    refreshToken: {
        type: String
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

ExtUserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var data = {
        // _id:user._id.toHexString()
        email: user.email,
        regno: user.regno
    }
    var token = jwt.sign(data, 'abc123').toString();
    this.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    })

};

const ExtUsers = mongoose.model('ExtUsers', ExtUserSchema);

module.exports = { ExtUsers };
