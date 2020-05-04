var Sequalize = require('sequelize')
var bcrypt = require('bcrypt');
// create a Sequalize instance with a local databsae information
// var sequelize = new Sequalize('postgres://postgres:password@localhost:5432/cropbank')
var sequelize = new Sequalize(process.env.DATABASE_URL)

var User = sequelize.define('users', {
    id: {
        type: Sequalize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: Sequalize.TEXT,
        unique: true
    },
    last_name: {
        type: Sequalize.TEXT,
        allowNull: false,
    },
    email: {
        type: Sequalize.TEXT,
        allowNull: false,
    },
    tel: {
        type: Sequalize.TEXT,
        allowNull: false,
    },
    country: {
        type: Sequalize.TEXT,
        allowNull: false,
    },
    password: {
        type: Sequalize.TEXT,
        allowNull: false,
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    },
    classMethods: {
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password)
        }
    }
});

sequelize.sync()
    .then(() => console.log('user table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

module.exports = User, bcrypt;