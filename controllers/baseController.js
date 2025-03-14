const utilites = require('../utilities/')
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilites.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav, errors: null})
}

baseController.Error = async function (req, res) {
    throw new Error('500')
}

module.exports = baseController