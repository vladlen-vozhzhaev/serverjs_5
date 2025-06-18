const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const exhbs = require('express-handlebars');
const path = require('path');
const multer  = require('multer')
const upload = multer();
const mysql = require('mysql2');
const dbConfig = {
    host: "127.127.126.50",
    user: "root",
    password: "",
    database: "express5"
}

app.engine('hbs', exhbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('main_page');
})
app.get('/login', (req, res)=>{
   res.render('login');
});
app.post('/login',  upload.any(), (req, res)=>{
    console.log(req.body.email);
    console.log(req.body.pass);
    res.send('ok');
});
app.get('/hello', (req, res)=>{
    res.send("TEST");
})
app.get('/addArticle', (req, res)=>{
    res.render('add_article');
});
app.post('/addArticle', upload.any(), (req, res)=>{
    const title = "Заголовк статьи";
    const content = "Контетн";
    const author = "Автор";
    const connection = mysql.createConnection(dbConfig);
    connection.execute(`INSERT INTO articles (title, content, author) VALUES (?, ?, ?)`, [title, content, author]);
    connection.end();
    res.send('ok');
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})