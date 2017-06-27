const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

  // app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  // app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/profile/:username', controllers.users.profile) // , auth.isAuthenticated
  app.get('/profile/:userId', controllers.users.profile)
  app.post('/users/block/:id', controllers.users.block)
  app.post('/users/unblock/:id', controllers.users.unblock)

  // app.get('/admins/add', controllers.users.adminGet) // auth.isInRole('Admin'),
  app.post('/admins/add', controllers.users.adminPost) // auth.isInRole('Admin'),
  app.get('/admins/all', controllers.users.all) // auth.isInRole('Admin'),

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
