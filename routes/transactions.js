const express = require('express');
const { addTransactions, deleteTransactions, editTransaction } = require('../controllers/transactions')

const router = express.Router();

// @route   POST /transactions
// @desc    To add new transaction
// @access  Private

router.post('/', addTransactions)

// @route   DELETE /transactions/:transactionId
// @desc    To delete a transaction
// @access  Private

router.delete('/:transactionId', deleteTransactions)

// @route   PATCH /transactions/:id
// @desc    TO edit a transaction
// @access  Private

router.patch('/:id', editTransaction)

module.exports = router