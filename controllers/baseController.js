const utilites = require('../utilities/')
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilites.getNav()
    res.render("index", {title: "Home", nav})
}

baseController.Error = async function (req, res) {
    throw new Error('500')
}

module.exports = baseController