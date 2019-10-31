const _ = require('lodash')
const BillingCycle = require('../billingCycle/billingCycle')

// Middleware to summarize payment cycles using mongo $project through a aggregation pipeline
function getSummary(req, res) {
    BillingCycle.aggregate([{
        $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}}
    }, {
        // Null indicate all values
        $group: {_id: null, credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
    }, {
        // Indicate what's going to be displayed        
        $project: {_id: 0, credit: 1, debt: 1}
    }]).exec((error, result) => {
        if(error) {
            res.status(500).json({errors: [error]})
        } else {
            res.json(_.defaults(result[0], {credit: 0, debt: 0}))
        }
    })
}

module.exports = { getSummary }