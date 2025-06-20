const express = require('express')
const app = express()
const exhbs = require('express-handlebars');
const path = require('path');
const multer  = require('multer')
const upload = multer();
const articleController = require('./controllers/articleController');
const User = require("./models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Домен клиента
    credentials: true,                   // Включаем передачу аутентификационных данных
}));

app.engine('hbs', exhbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// Проверка токена перед обработкой запросов
// Обработчик токена (единственный экземпляр!)
const excludedRoutes = ['/login', '/reg'];
app.use((req, res, next) => {
    if (excludedRoutes.includes(req.path)) {
        return next(); // Пропустить проверку токена для этих путей
    }
    const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token === null) {
        req.user = null;
        next();

    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                res.clearCookie('jwt');
                // После удаления токена перенаправляем пользователя на страницу логина
                res.redirect('/login');
                return;
            } // Недопустимый токен
            req.user = user;                     // Добавляем объект пользователя в request
            next();                              // Переход к следующему middleware
        });
    }
});

// Локальное хранение пользователя
app.use((req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;              // Присваиваем текущего пользователя в locals
    }
    next();
});

app.get('/', articleController.showMainPage);
app.get('/articles/{:id}', articleController.showSingleArticle);
app.get('/editArticle/{:id}', articleController.showEditArticle);
app.post('/editArticle', upload.any(), articleController.editArticle);

app.get('/deleteArticle/{:id}', articleController.deleteArticle);
app.post('/addArticle', upload.any(), articleController.addArticle);
app.get('/addArticle', (req, res)=>{res.render('add_article');});
app.get('/reg', (req, res)=>{
   res.render('reg');
});
app.post('/reg',  upload.any(), async (req, res)=>{
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findByLogin(email);
        if(existingUser){
            return res.render('reg', {error: "Пользователь с таким email уже существует"})
        }
        const userId = await User.create({username, email, password});
        res.redirect('/login');
    }catch (e){
        res.status(500).send("reg error");
    }
});
app.get('/login', (req, res)=>{
   res.render('login');
});
app.post('/login',  upload.any(), async (req, res)=>{
    const {email, pass} = req.body;
    const user = await User.findByLogin(email);
    if(!user){
        res.render('login', {error: "Неправильный логин или пароль"})
    }
    const isMatch = await bcrypt.compare(pass, user.pass);
    if(!isMatch){
        res.render('login', {error: "Неправильный логин или пароль"})
    }
    const token = jwt.sign(
        { id: user.id, username: user.name, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000
    });
    res.redirect('/');
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})