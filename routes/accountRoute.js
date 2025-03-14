// Needed Resources
const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const utilVal = require('../utilities/account-validation');
const accountCont = require('../controllers/accountController');

// Route to build inventory by classification view
router.get('/login', utilities.handleErrors(accountCont.buildLogin))
router.get('/register', utilities.handleErrors(accountCont.buildRegister))
router.post('/register', utilVal.registationRules(),
    utilVal.checkRegData, utilities.handleErrors(accountCont.registerAccount))
router.post('/login', utilVal.loginRules(),
    utilVal.checkLogData, utilities.handleErrors(accountCont.loginAccount))
router.get('/', utilities.checkLogin, utilities.handleErrors(accountCont.buildAccount))

module.exports = router;