const _ = require('lodash')
const BillingCycle = require('./billingCycle')
const exceptionHandler = require('../exception/exceptionHandler')

// Create billing cycle REST service
BillingCycle.methods(['get', 'post', 'put', 'delete'])

// Always return new values and run validations during update operations
BillingCycle.updateOptions({new: true, runValidators: true})

// Intercept requests to keep an error pattern
BillingCycle.after('post', exceptionHandler.sendErrorsOrNext).after('put', exceptionHandler.sendErrorsOrNext)

BillingCycle.route('count', function(req, res, next) {
    BillingCycle.count(function(error, value) {
        if(error) {
            res.status(500).json({errors: [error]})
        } else {
            res.json({value})
        }
    })
})

module.exports = BillingCycle