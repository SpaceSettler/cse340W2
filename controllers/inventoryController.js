const invModel = require("../models/inventory-models")
const utilites = require('../utilities/')

const invCont = {}

/* ************************
 * Build the inventory by classification view
 * ************************ */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    let data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilites.buildClassificationGrid(data)
    let nav = await utilites.getNav()
    if (data.length < 1) {
        data = await invModel.getClassificationName(classification_id)
    }
    const className = data[0].classification_name
    res.render("./inventory/classification", {title: className + " vehicles", nav, grid, errors: null})
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilites.buildInventoryGrid(data)
    let nav = await utilites.getNav()
    const year = data[0].inv_year
    const make = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/classification", {title: year + ' ' + make + ' ' + model, nav, grid, errors: null})
}

invCont.buildCustom = async function (req, res, next) {
    let nav = await utilites.getNav()
    res.render("./inventory/management", {
        title: "Management",
        nav, errors: null,
      })
}

invCont.buildCustomClass = async function (req, res, next) {
    let nav = await utilites.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav, errors: null,
      })
}

invCont.buildCustomVehic = async function (req, res, next) {
    let nav = await utilites.getNav()
    let classifications = await invModel.getClassifications()
    res.render("./inventory/add-inventory", {
        title: " Add New Vehicle",
        classifications, nav, errors: null,
      })
}

invCont.addVehicle = async function (req, res, next) {
    let nav = await utilites.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const data = await invModel.addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    let classifications = await invModel.getClassifications()
    if (data["rows"].length > 0) {
        req.flash("notice", `Vehicle added.`)
        res.status(201).render("./inventory/management", {
            title: "Management",
            nav, errors: null,
        })
    } else {
        req.flash("error", `Sorry, the vehicle was not added. Please try again.`)
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            classifications, nav, errors: null,
        })
    }
}

invCont.addClassification = async function (req, res, next) {
    let nav = await utilites.getNav()
    const { classification_name } = req.body
    const data = await invModel.addClassification(classification_name)
    if (data["rows"].length > 0) {
        nav = await utilites.getNav()
        req.flash("notice", `Classification ${classification_name} added.`)
        res.status(201).render("./inventory/management", {
            title: "Management",
            nav, errors: null,
        })
    } else {
        req.flash("error", `Sorry, the classification was not added. Please try again.`)
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav, errors: null,
        })
    }
}

module.exports = invCont