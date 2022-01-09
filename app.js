const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override') // function for ?_method=PUT and ?_method=DELETE
const session = require('express-session')

const app = express()
const port = 3000

const routes = require('./routes') // router
const userPassport = require('./config/passport')

require('./config/mongoose') // mongoose connection

// setting handlebars
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
      ifEqual: function (a, b) {
        if (a === b) {
          return 'selected'
        } else {
          return ''
        }
      },
    },
  })
)
app.set('view engine', 'hbs')

// use session for specific user
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false, // 此爲進階的 session store 需求，可以再深入去研究
    saveUninitialized: true, // 此爲進階的 session store 需求，可以再深入去研究
  })
)

// use css & js
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) // Express include the body-parser from version 4.16.0
userPassport(app) // Passport verification

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated() // 每次開啓頁面就會先確認抓取是否已通過 userPassport(app) 認真確認有登入的權限
  res.locals.user = req.user
  next()
})

app.use(routes) // router connection

// router listener
app.listen(port, () => {
  console.log(`express is listening on localhost: ${port}`)
})
