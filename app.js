const express = require('express')
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const csrf = require('csurf')
const csrfProtection = csrf({
    cookie: true
})

const countryList = require('./country')
const User = require('./models/user')
const bcrypt = require('bcrypt');
const app = express();

app.engine('.hbs', exphbs({
    extname: '.hbs'
}))
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(morgan('dev'))
app.use(express.urlencoded());
app.use(cookieParser())
app.use(session({
    key: 'user_sid',
    secret: '2432mpfm2fii@@P~~~~##',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
    }
}))
app.use(function (req, res, next) {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid')
    }
    next()
})

var sessionChecker = function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/cropbank');
    } else {
        next()
    }
}
app.get('/', csrfProtection, sessionChecker, function (req, res) {
    res.redirect('/signin');
})
app.route('/signup')
    .get(sessionChecker, csrfProtection, function (req, res) {
        res.render('signup', {
            layout: 'home',
            csrfToken: req.csrfToken(),
            countryList: countryList,
        })
    })
    .post(function (req, res) {
        User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                tel: req.body.tel,
                country: req.body.country,
                password: req.body.password,
            })
            .then(user = function () {
                req.session.user = user.dataValues;
                res.redirect('/cropbank')
            })
            .catch(error = function () {
                res.redirect('/signup')
            })
    })
app.route('/signin')
    .get(sessionChecker, csrfProtection, function (req, res) {
        res.render('signin', {
            layout: 'home',
            csrfToken: req.csrfToken()
        })
    })
    .post(function (req, res) {

        var email = req.body.email,
            password = req.body.password;
        User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            if (!user) {
                res.redirect('/signin');
            } else if (!bcrypt.compareSync(password, user.password)) {
                res.redirect('/signin')
            } else {
                req.session.user = user.dataValues
                res.redirect('/cropbank')
            }
        })
    })
app.get('/cropbank', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('cropbank', {
            layout: 'main',
        })
    } else {
        res.redirect('/signin')
    }
})
app.get('/logout', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/')
    } else {
        res.redirect('/signin')
    }
})
app.use(function (req, res, next) {
    res.status(404).send("sorry can't find that!")
})


app.listen(PORT);