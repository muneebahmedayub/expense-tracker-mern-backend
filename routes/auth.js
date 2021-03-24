const express = require('express')
const { signup, login, deleteUser, getUser } = require('../controllers/auth')
const auth = require('../middleware/auth')
const router = express()

// @route   POST /auth/signup
// @desc    TO regiter new user
// @access  Public

router.post('/signup', signup)

// @route   POST /auth/login
// @desc    TO login user
// @access  Public

router.post('/login', login)

// @route   DELETE /auth/delete/:id
// @desc    TO delete a user
// @access  Public

router.delete('/delete/:id', deleteUser)

// @route   GET /auth/user
// @desc    TO get a user
// @access  Private

router.get('/user', auth, getUser)

module.exports = router