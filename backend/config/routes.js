const express = require('express')
const auth = require('./auth')
const billingCycleService = require( '../api/billingCycle/billingCycleService')     
const billingSummaryService = require('../api/billingSummary/billingSummaryService')     

module.exports = function(server) {

    /*      
     * Open Routes
     */     
    const openApi = express.Router()     
    server.use('/oapi', openApi)
    const AuthService = require('../api/user/authService')     
    openApi.post('/login', AuthService.login)     
    openApi.post('/signup', AuthService.signup)     
    openApi.post('/validateToken', AuthService.validateToken)

    /*      
     * Protected Routes (Using JWT)
     */     
    const protectedApi = express.Router()     
    server.use('/api', protectedApi)

    protectedApi.use(auth)

    // Enable the billing cycle information service 
    billingCycleService.register(protectedApi, '/billingCycles')
    
    // Enable the summary operations service
    protectedApi.route('/billingSummary').get(billingSummaryService.getSummary)

}