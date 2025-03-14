// Needed Resources
const express = require('express');
const router = express.Router();
const inventoryCont = require('../controllers/inventoryController');
const utilVal = require('../utilities/account-validation');
const utilities = require('../utilities/');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(inventoryCont.buildByClassificationId))
router.get('/detail/:inventoryId', utilities.handleErrors(inventoryCont.buildByInventoryId))
router.get('/', utilities.handleErrors(inventoryCont.buildCustom))
router.get('/classification', utilities.handleErrors(inventoryCont.buildCustomClass))
router.get('/vehicle', utilities.handleErrors(inventoryCont.buildCustomVehic))
router.post('/addVehi', utilVal.addVRules(),
    utilVal.checkVehiData, utilities.handleErrors(inventoryCont.addVehicle))
router.post('/addClass', utilVal.addCRules(),
    utilVal.checkClassData, utilities.handleErrors(inventoryCont.addClassification))

module.exports = router;