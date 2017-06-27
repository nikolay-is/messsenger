// const mongoose = require('mongoose')

module.exports = {
  about: (req, res) => {
    res.json({message: 'Messenger Api v1.0.0'}) 
  },
  index: (req, res) => {
    res.json({message: 'Welcome to our api!'}) 
  }
}
