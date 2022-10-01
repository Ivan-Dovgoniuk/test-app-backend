const {Schema, model} = require('mongoose')


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    activationCode: {type: String},
    favoriteDragons:{type:Array}
})

module.exports = model('Users', User)
