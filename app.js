const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const hbs = exphbs.create({
    'helpers': {
        foo: () => 'foo!',
        bar: () => 'bar!',
    },
    defaultLayout: 'header',
});

// process.env.NODE_ENV === "production";
var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

app.engine('.hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('home', {
        'fortunes': randomFortune
    });
})

app.listen(3000);