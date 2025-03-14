const invModel = require("../models/inventory-models")
const Util = {}
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ************************
 * Constructs the nav HTML unordered list
 * ************************ */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += "<li><a href='/' title='Home Page'>Home</a></li>"
    data.rows.forEach(row => {
        list += `<li><a href='/inv/type/${row.classification_id}' 
        title='See our inventory of ${row.classification_name} vehicles'>
        ${row.classification_name}</a></li>`
    })
    list += "</ul>"
    return list
}

/* ************************
 * Builds the classification view HTML
 * ************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if(data.length > 0){
        grid = "<ul id='inv-display'>"
        data.forEach(vehicle => {
            grid += `<li><a href='/inv/detail/${vehicle.inv_id}'
             title='View ${vehicle.inv_make} ${vehicle.inv_model} details'>
             <img src='${vehicle.inv_thumbnail}'
             alt='Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors' /></a>
             <div class='namePrice'><hr /><h2>
             <a href='../../inv/detail/${vehicle.inv_id}' title='View ${vehicle.inv_make} ${vehicle.inv_model} details'>
             ${vehicle.inv_make} ${vehicle.inv_model}</a></h2>
             <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
             </div></li>`
        })
    } else {
        grid =+ '<li class="notice">Sorry, no matching vehicles could be found.</li>'
    }
    grid += '</ul>'
    return grid
}

Util.buildInventoryGrid = async function (data) {
    let grid
    if(data.length > 0){
        grid = "<div id='inv-display_single'>"
        data.forEach(vehicle => {
            grid += `<img class='bigger' src='${vehicle.inv_image}' alt='Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors'>
            <img class='smaller' src='${vehicle.inv_thumbnail}' alt='Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors'>
             <div class='namePrice'>
             <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
             <p>Price:   $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
             <p>Description:   ${vehicle.inv_description}</p>
             <p>Mileage:   ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
             <p>Color:   ${vehicle.inv_color}</p>
             </div>`
        })
        grid += '</div>'
    } else {
        grid =+ '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
     jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
       if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
       }
       res.locals.accountData = accountData
       res.locals.loggedin = 1
       next()
      })
    } else {
     next()
    }
   }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
}

module.exports = Util