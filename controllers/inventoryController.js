const invModel = require("../models/inventory-models")
const utilites = require('../utilities/')

const invCont = {}

/* ************************
 * Build the inventory by classification view
 * ************************ */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilites.buildClassificationGrid(data)
    let nav = await utilites.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {title: className + " vehicles", nav, grid})
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilites.buildInventoryGrid(data)
    let nav = await utilites.getNav()
    const year = data[0].inv_year
    const make = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/classification", {title: year + ' ' + make + ' ' + model, nav, grid})
}

module.exports = invCont