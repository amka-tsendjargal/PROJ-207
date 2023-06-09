const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize('travelexperts', 'xiangshuo', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, password } });

    if (user) {
        res.status(200).json({ message: 'Login Successful' });
    } else {
        res.status(400).json({ message: 'Invalid Credentials' });
    }
});

app.listen(8000, () => {
    console.log('Server started on port 8000');
});
