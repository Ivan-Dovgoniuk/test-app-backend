const User = require('../models/User')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const MailService =require('../services/mailService')

const apiURL = process.env.NODE_ENV === 'dev' ? process.env.DEV_API_URL : process.env.PRO_API_URL
const clientURL = process.env.NODE_ENV === 'dev' ? process.env.DEV_CLIENT_URL : process.env.PRO_CLIENT_URL

const generateAccessToken = (id) => {
    const secret = process.env.JWT_ACCESS_SECRET
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "7d"} )
}

class userController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username,password,email} = req.body;
            const newUserName = await User.findOne({username})
            if (newUserName) {
                return res.status(400).json({message: "This username alredy exists"})
            }
            const newUserEmail = await User.findOne({email})
            if (newUserEmail) {
                return res.status(400).json({message: "This email alredy registered"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const activationLink = uuid.v4();
            const user = await new User({username,password:hashPassword,activationLink,email,isActivated:false})
            await user.save()
            await MailService.sendActivationMail(email,{link:`${apiURL}/activate/${activationLink}`,username,email,password});
            return res.json({message: "User successfully registered"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link;
            const user = await User.findOne({activationLink})
        if (!user) {
            return res.status(400).json({message: "Incorrect activation link"})
        }
        user.isActivated = true;
        await user.save();
            return res.redirect(`${clientURL}/login`);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: `Password or email incorect`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Password or email incorect`})
            }
            const activated = user.isActivated;
            if(!activated){
                const activationCode = uuid.v4();
                await MailService.sendActivationCode(email, activationCode);
                user.activationCode = activationCode;
                await user.save();
                const token = false;
                return res.json({token,activated})
            }
            const token = generateAccessToken(user._id)
            return res.json({token,activated})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async login2FA(req, res) {
        try {
            const activationCode = req.body.activationCode
            const user = await User.findOne({activationCode})
            if (!user) {
                return res.status(400).json({message: `Activation code incorect`})
            }
            user.isActivated = true;
            await user.save();
            const activated = user.isActivated;
            const token = generateAccessToken(user._id)
            return res.json({token,activated})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUser(req, res) {
        const userID = req.userData.id
        try {
            const user = await User.findOne({_id:userID})
            const {username,email,favoriteDragons,isActivated} = user;
            res.json({username,email,favoriteDragons,isActivated})
        } catch (e) {
            console.log(e)
        }
    }

    async editUser(req, res) {
        const userID = req.userData.id
        try {
            const newUsername = req.body.username;
            const newEmail = req.body.email;
            const newPassword = req.body.password;
            const newUserEmail =newEmail && await User.findOne({email:newEmail})
            if (newUserEmail) {
                return res.status(400).json({message: "This email alredy registered"})
            }
            const newUserName = newUsername && await User.findOne({username:newUsername})
            if (newUserName) {
                return res.status(400).json({message: "This username alredy exists"})
            }
            const user = await User.findOne({_id:userID})
            if(newPassword & newPassword !=0){
                const hashPassword = bcrypt.hashSync(newPassword, 7);
                user.password=hashPassword
            }
            if(newUsername){
                user.username = newUsername
            }
            if(newEmail){
                user.email =newEmail
            }
            await user.save()
            const {username,email,favoriteDragons}=user;
            res.json({username,email,favoriteDragons})
        } catch (e) {
            console.log(e)
        }
    }
    async logOut(req,res){
        const userID = req.userData.id
        console.log(req)
        try {
            const user = await User.findOne({_id:userID})
            user.isActivated = false;
            await user.save();
            const isActivated =user.isActivated
        res.status(200).json({isActivated})
        } catch (e) {
            console.log(e)
        }
    }
    async addFavoriteDragon(req,res){
        const userID = req.userData.id
        const newFavoriteDragon = req.body.newFavoriteDragon
        try {
            const user = await User.findOne({_id:userID})
                user.favoriteDragons.push(newFavoriteDragon)
                await user.save();
                res.json(user.favoriteDragons)
        } catch (e) {
            console.log(e)
        }
    }
    async deleteFavoriteDragon(req,res){
        const userID = req.userData.id
        const deletedDragon = req.body.deletedDragon
        try {
            const user = await User.findOne({_id:userID})
            const newListFavoritesDagons = user.favoriteDragons.filter(
                item=>{
                return item !=deletedDragon
                })
                user.favoriteDragons = newListFavoritesDagons
                await user.save();
                res.json(user.favoriteDragons)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new userController()
