// Needed Resources
const express = require('express');
const router = express.Router();
const inventoryCont = require('../controllers/inventoryController');
const utilities = require('../utilities/');
const baseController = require('../controllers/baseController');

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(inventoryCont.buildByClassificationId))
router.get('/detail/:inventoryId', utilities.handleErrors(inventoryCont.buildByInventoryId))

module.exports = router;