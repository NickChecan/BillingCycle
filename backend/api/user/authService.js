const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')
const exceptionHandler = require('../exception/exceptionHandler')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/

const login = (req, res) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {
        if (err) {
            return exceptionHandler.sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, { expiresIn: "1 day" })
            const { name, email } = user // Name and e-mail extraction
            res.json({ name, email, token })
        } else {
            return res.status(400).send({ errors: ['Invalid user/password.'] })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {     
    const name = req.body.name || ''     
    const email = req.body.email || ''     
    const password = req.body.password || ''     
    const confirmPassword = req.body.confirmPassword || ''

    if(!email.match(emailRegex)) {
        return res.status(400).send({errors: ['Invalid e-mail.']})     
    }

    if(!password.match(passwordRegex)) {
        return res.status(400).send({errors: [    
            "Password must contain at least: one upper case character, one lower case character, a number, a special character(@#$%) and size between 6-12."
        ]})     
    }

    const salt = bcrypt.genSaltSync()     
    const passwordHash = bcrypt.hashSync(password, salt)     
    if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({errors: ['Passwords does not match.']})
    }

    User.findOne({email}, (err, user) => {
        if(err) {    
            return exceptionHandler.sendErrorsFromDB(res, err)
        } else if (user) {    
            return res.status(400).send({errors: ['User already registered.']})
        } else {    
            const newUser = new User({ name, email, password: passwordHash })    
            newUser.save(err => {        
                if(err) {            
                    return exceptionHandler.sendErrorsFromDB(res, err)        
                } else {            
                    login(req, res, next)        
                }    
            })
        }     
    })

}

module.exports = { login, signup, validateToken }
