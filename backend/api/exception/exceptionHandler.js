const _ = require('lodash')

/*
 * Handle error for CRUD services operations
 */
const sendErrorsOrNext = (req, res, next) => {
    const bundle = res.locals.bundle
    if(bundle.errors) {
        var errors = parseErrors(bundle.errors)
        res.status(500).json({errors})
    } else {
        next()
    }
}

function parseErrors(nodeRestfulErrors) {
    const errors = []
    _.forIn(nodeRestfulErrors, error => errors.push(error.message))
    return errors
}

/*
 * Handle database exceptions
 */
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

module.exports = { sendErrorsOrNext, sendErrorsFromDB }