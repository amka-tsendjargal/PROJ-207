const express = require('express');
const mysql = require('mysql')

const app = express();

app.listen(8000, (err) => {
    if (err) throw err;
    console.log('Server listening on port 8000.')
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (request, response) =>{
    response.render('index', {pageTitle: 'Home'})
})

// This is section is for rendering the packages page

app.get('/packages', (request, response) => {
    response.render('packages', {pageTitle: 'Packages'})
})

// This is section is for rendering the contact page

app.get('/contact', (request, response) => {
    response.render('contact', {pageTitle: 'Contact Us'})
})

app.get('/register', (request, response) => {
    response.render('register', {pageTitle: 'Join Us'})
})