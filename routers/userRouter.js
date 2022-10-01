const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const {check} = require("express-validator")
const authMiddleware = require('../middlewaree/authMiddleware')

router.post('/registration', [
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password must be more than 4 characters").isLength({min:4}),
    check('email',"Email incorrect").isEmail()
], userController.registration)
router.get('/activate/:link', userController.activate);
router.post('/login', userController.login)
router.post('/login2FA', userController.login2FA)
router.get('/user',authMiddleware,userController.getUser)
router.post('/editUser',authMiddleware,userController.editUser)
router.post('/logOut',authMiddleware,userController.logOut)
router.post('/addDragon',authMiddleware,userController.addFavoriteDragon)
router.post('/deleteDragon',authMiddleware,userController.deleteFavoriteDragon)


module.exports = router
