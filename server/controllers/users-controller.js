const encryprion = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')
// const Image = mongoose.model('Image')

const errorHandler = require('../utilities/error-handler')

module.exports = {
  // registerGet: (req, res) => {
  // },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validation
    // if (reqUser.username.lenght < 3)
    User.findOne({username: reqUser.username})
      .then(user => {
        if (user) {
          // res.locals.globalError = `User "${user.username}" is allready exist!`
          // res.render('users/register', {
          //   user: reqUser
          // })
          // res.send({message: res.locals.globalError})
          return res.status(400).send({ message: `User "${user.username}" is allready exist!` })
        }

        let salt = encryprion.generateSalt()
        let hashedPassword = encryprion.generateHashedPassword(salt, reqUser.password)

        User.create({
          username: reqUser.username,
          firstName: reqUser.firstName,
          lastName: reqUser.lastName,
          salt: salt,
          hashedPass: hashedPassword,
          roles: ['User']
        }).then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              // res.locals.globalError = err
              // res.render('users/register', user)
              // res.send(res.locals.globalError)
              return res.status(200).send({ message: 'Wrong credentials!' })
            }

            // res.redirect('/')
            // res.json({message: 'User created successfully!'})
            return res.status(200).send({ message: 'User created successfully!' })
          })
        })
        .catch(err => {
          let errMessage = errorHandler.handleMongooseError(err)
          res.status(500).send({ message: errMessage })
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    // res.redirect('/')
    res.status(200).end()
  },
  // loginGet: (req, res) => {
  //   res.render('users/login')
  // },
  loginPost: (req, res) => {
    let reqUser = req.body
    console.log(req.body)
    User.findOne({username: reqUser.username}).then(user => {
      if (!user) {
        // res.locals.globalError = 'Invalid user data'
        // res.render('users/login')
        // return
        return res.status(401).send({ message: 'Invalid user data!' })
      }

      if (!user.authenticate(reqUser.password)) {
        // res.locals.globalError = 'Invalid user data'
        // res.render('users/login')
        // return
        return res.status(401).send({ message: 'Invalid user data!' })
      }

      req.logIn(user, (err, user) => {
        if (err) {
          // res.locals.globalError = err
          // res.render('users/login')
          return res.status(401).send({ message: err })
        }

        // res.redirect('/')
        res.status(200).send(req.user._id)
      })
    })
  },
  profile: (req, res) => {
    let username = req.params.username
    User.findOne({ username: username })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: 'User no longer exists' })
        }
        res.status(200).send(user)
      })
  },
  profileId: (req, res) => {
    let userId = req.params.userId
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: 'User no longer exists' })
        }
        res.status(200).send(user)
      })
  },
  // adminGet: (req, res) => {
  //   User.find({ roles: { $ne: 'Admin' } })
  //     .then(users => {
  //       res.render('users/admin-add', {
  //         users: users
  //       })
  //     })
  // },
  adminPost: (req, res) => {
    let userId = req.body.user
    User.findByIdAndUpdate(userId, { $addToSet: { roles: 'Admin' } })
      .then(() => {
        // res.redirect('/admins/all')
        res.status(200).send({ message: 'Role Admin added to user' })
      })
      .catch(err => {
        let errMessage = errorHandler.handleMongooseError(err)
        res.status(500).send({ message: errMessage })
      })
  },
  all: (req, res) => {
    User.find({ roles: { $in: ['Admin'] } })
      .then(admins => {
        // res.render('users/admin-all', {
        //   admins: admins
        // })
        // res.json({admins})
        res.status(200).send(admins)
      })
  },
  block: (req, res) => {
    let userId = req.params.id
    User.findByIdAndUpdate(userId, { $set: { blocked: true } })
      .then(user => {
        // res.redirect('/admins/all')
        res.status(200).send({ message: 'User is blocked successfully' })
      })
      .catch(err => {
        let errMessage = errorHandler.handleMongooseError(err)
        // res.locals.globalError = message
        // res.redirect('/')
        res.status(500).send({ message: errMessage })
      })
  },
  unblock: (req, res) => {
    let userId = req.params.id
    User.findByIdAndUpdate(userId, { $set: { blocked: false } })
      .then(user => {
        // res.redirect('/admins/all')
        res.status(200).send({ message: 'User is unblocked successfully' })
      })
      .catch(err => {
        let errMessage = errorHandler.handleMongooseError(err)
        // res.locals.globalError = message
        // res.redirect('/')
        res.status(500).send({ message: errMessage })
      })
  }
}
