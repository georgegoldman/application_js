const express = require('express');
const exphbs = require('express-handlebars');
// const {
//     Pool,
//     Client
// } = require('pg')
// const connectionString = 'postgresql://postgres:password@localhost:5432/cropbank'

// const client = new Client({
//     connectionString: connectionString,
// })
// client.connect()
// client.query('SELECT * from comapny', (err, res) => {
//     console.log(err, res);
//     client.end
// })

const PORT = process.env.PORT || 5000;

const app = express();
app.engine('.hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.get('/', function (req, res) {
    res.render('home', {
        layout: null,
    })
})
app.listen(PORT);