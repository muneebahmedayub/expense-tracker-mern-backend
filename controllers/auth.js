const User = require('../models/User')
const Transaction = require('../models/Transaction')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const validation = (username, password) => {
    if(!username || !password) throw Error('Please enter all fields')
    if(username.length < 4) throw Error('Username must be greater than or equal to 4 characters')
    if(password.length < 8) throw Error('Password must have at least 8 characters')
}

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body

        validation(username, password)

        const exUser = await User.findOne({ username })

        if (exUser) throw Error('This username is already taken, please try another one')

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ username, password: hashedPassword })

        const token = jwt.sign({ _id: newUser._id }, process.env.JWTSECRET, { expiresIn: 3600 })

        if (!token) throw Error('Couldnt sign in token')

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: newUser._id,
                username: newUser.username,
                transactions: newUser.transactions
            }
        })

    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) throw Error('Please enter all fields')

        const foundUser = await User.findOne({ username }).populate('transactions')

        if (!foundUser) throw Error('No such user exist.')

        if (await bcrypt.compare(password, foundUser.password)) {
            const token = jwt.sign({ _id: foundUser._id }, process.env.JWTSECRET, { expiresIn: 3600 })
            if (!token) throw Error('Couldnt sign the token')

            res.status(200).json({
                success: true,
                token,
                user: {
                    _id: foundUser._id,
                    username: foundUser.username,
                    transactions: foundUser.transactions
                }
            })
        } else throw Error('Invalid Credentials')


    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) throw Error('User not found')

        await Transaction.deleteMany({ user: req.params.id })

        await user.remove()

        res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('transactions')

        if (!user) throw Error('User does not exist')

        res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            error: err.message
        })
    }
}