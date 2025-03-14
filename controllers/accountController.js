const utilites = require('../utilities/')
const accountModel = require('../models/account_models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilites.getNav()
    res.render("account/login", {
      title: "Login",
      nav, errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilites.getNav()
    res.render("account/register", {
      title: "Register",
      nav, errors: null,
    })
  }
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilites.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
    if (regResult["rows"].length > 0) {
        req.flash("notice", `Congratulations ${account_firstname}! You are now registered. Please login.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav, errors: null,
        })
    } else {
        req.flash("error", `Sorry ${account_firstname}, the registration failed. Please try again.`)
        res.status(501).render("account/register", {
            title: "Register",
            nav, errors: null,
        })
    }
}

async function loginAccount(req, res) {
  let nav = await utilites.getNav()
  const { account_email, account_password } = req.body

  const email = await accountModel.checkExistingEmail(account_email)
  if (email) {
    const password = await accountModel.checkMatchingPassword(account_email, account_password)
    if (password) {
      const account = await accountModel.getAccountByEmail(account_email)
      const accessToken = jwt.sign(account, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      //req.flash("notice", `Welcome back ${account_email}!`)
      //res.status(201).render("/account", {
      // title: "Home",
      //  nav, errors: null,
      //})
      return res.redirect("/account")
    }
  }
    req.flash("error", `No matching account found. Please try again.`)
    res.status(400).render("account/login", {
        title: "Login",
        nav, errors: null, account_email,
    })
}
async function buildAccount (req, res) {
  let nav = await utilites.getNav()
  res.render("account/account", {
    title: "Account",
    nav, errors: null,
  })  
}


module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildAccount }