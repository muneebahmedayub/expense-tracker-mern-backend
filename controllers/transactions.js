const Transaction = require('../models/Transaction')
const User = require('../models/User')

exports.addTransactions = async (req, res) => {
    try {
        const { description, amount, income, updatedAt } = req.body
        const user = await User.findById(req.user._id)

        if(!user) return res.status(404).json({
            success: false,
            error: "No user with this id exists."
        })

        const transactionObj = {
            description,
            amount,
            income,
            updatedAt,
            user: user._id
        }

        const transaction = await Transaction.create(transactionObj)

        user.transactions.push(transaction._id)

        await user.save()

        res.json({
            success: true,
            data: transaction
        })
    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
}

exports.deleteTransactions = async (req, res) => {
    try {
        const { transactionId } = req.params
        const userId = req.user._id
        const transaction = await Transaction.findById(transactionId)
        const user = await User.findById(userId)

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: "Transaction not found"
            })
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        user.transactions.pull(transactionId)

        await user.save()

        await transaction.remove()

        return res.json({
            success: true,
            data: transaction
        })

    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
}

exports.editTransaction = async (req, res) => {
    try {
        const { id: _id } = req.params
        const { description, amount, income, updatedAt } = req.body

        const transaction = await Transaction.findById(_id)

        if(!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No Transaction found'
            })
        }

        transaction.description = description
        transaction.amount = amount
        transaction.income = income
        transaction.updatedAt = updatedAt

        const updatedTransaction = await transaction.save()

        return res.json({
            success: true,
            data: updatedTransaction
        })
        
    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
}