// npm i express cors mongoose axios nodemon vue-router dayjs express-session cookie-parser
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3005;
const session = require('express-session');
const cookieParser = require("cookie-parser");

let corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
    secret: "6iKfU6KQQqPf4GhPkV17",
    saveUninitialized: true,
    resave: true,
    rolling: false,
    cookie: { maxAge: 600000000000 }
}));

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});

//Подключение mongoDB

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Lodging');

app.get('/', (req, res) => {
    res.send('Сервер запущен');
    res.sendStatus(200);
});

//Все товары

const productSchema = new mongoose.Schema({
	title: {
        type: String,
        required: true,
        min: 4
    },
	description: {
        type: String,
        required: true,
        min: 12,
        max: 2000,
    },
	author: {
        type: String,
        required: true,
    },
	isHotel: {
        type: Boolean,
        required: true,
    },
	city:  {
        type: String,
        required: true,
    },
	price: {
        type: Number,
        required: true,
        max: 2000000,
    },
	raiting: {
        type: Number,
        min: 1,
        max: 5,
    },
	images: [String],
	phoneNumber: {
        type: String,
        required: true,
        min: 8
    },
    places: {
        type: Number,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

productSchema.index({'$**': 'text'});

let Product = mongoose.model('product', productSchema);

app.get('/products', async (req, res) => {
    const isHotel = req.query.isHotel;
    const filtre = req.query.filtre;
    const city = req.query.city;
    const sPrice = Number(req.query.sPrice);
    const dPrice = Number(req.query.dPrice);
    const title = req.query.title; // название

    let sorting = {}; 
    if(filtre == 'price1' && filtre != 'null') {
        sorting.price = 1;
    } 
    if(filtre == 'price-1' && filtre != 'null') {
        sorting.price = -1;
    } 
    if(filtre == 'raiting1' && filtre != 'null') {
        sorting.raiting = 1;
    } 
    if(filtre == 'raiting-1' && filtre != 'null') {
        sorting.raiting = -1;
    }
    if(filtre == 'data1' && filtre != null) {
        sorting.createdAt = 1;
    } 
    if(filtre == 'data-1' && filtre != null) {
        sorting.createdAt = -1;
    } 

    let search = {};
    if (isHotel && isHotel != 'null') {
        search.isHotel = isHotel;
    } if(title) {
        search.$text = {$search: title}
    } if(city) {
        search.city = city;
    }
    
    if (sPrice) {
        search.price = {$gte: sPrice};
    } if (dPrice) {
        search.price = {$lte: dPrice};
    } if(sPrice && dPrice) {
        search.price = {$gte: sPrice, $lte: dPrice};
    }

    let data = await Product.find(search).sort(sorting);
    res.send(data).status(200);
});

app.get('/myProducts', async (req, res) => {
    const id = req.query.id;
    let {login} = await User.findOne({_id: id})
    let data = await Product.find({author: login});
    if(data) {
        try {
            res.send(data).status(200);
        } catch (error) {
            res.send(error).status(400);
        }
    } else {
        res.send('Товаров не найдено').status(200);
    }
});

app.post('/products', async (req, res) => {
    const { title, description, price, category, image, isGood, countHas, brand } = req.body;
    // add authorId

    const product = new Product({
        title: title,
        description: description,
        price: price,
        category: category,
        image: image,
        isMine: true,
        isGood: isGood,
        countHas: countHas,
        brand: brand,
        author: req.session.username,
    });

    try {
        await product.save();
        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

app.delete('/products', async (req,res) => {
    const id = req.query.id;
    
    try {
        await Product.deleteOne({_id: id});
        res.sendStatus(202);
    } catch {
        res.sendStatus(400);
    }
});

app.put('/products', async (req, res) => {
    const { id, title, description, price } = req.body;
    let product = await Product.findOne({_id: id});

        product.title = title;
        product.description = description;
        product.price = price;
    try {
        await product.save();
        res.sendStatus(201);
    } catch(err) {
        res.send(err).status(400)
    }
});

//Один товар и доп товар

app.get('/product', async (req, res) => {
    const id = req.query.id;
    const data = await Product.findOne({_id: id});
    res.send(data).status(200);
});


//Вход пользователей и их регистрация

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 24,
    },
    avaImage: String,
    role:{
        type: String,
        require: true,
    },
    reviews: [{
        user: {
            type: Object,
            require: true,
        },
        comment: {
            type: String,
            require: true,
            min: 3,
            max: 500,
        },
        raiting: {
            type: Number,
            require: true,
            min: 1,
            max: 5,
        }
    }],
    cart: [{
        idProduct: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
            min: 1,
            max: 20000000
        },
        author: {
            type: String,
            required: true,
        },
        isHotel: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        raiting: {
            type: String,
            required: true,
        },
        images: [{
            type: String,
            required: true,
        }],
        phoneNumber: {
            type: String,
            required: true,
        },
        places: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
    }],
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

app.get('/login', async (req, res) => {
    const { login, password } = req.query;
    const data = await User.findOne({login: login});
    if(data) {
        if(data.password == password) {
            req.session.username = login;
            res.send(data).status(200);
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get('/user', async (req, res) => {
    const id = req.query.id;
    const data = await User.findOne({_id: id});
    if(data && id) {
        data.password = ``;
        try {
            res.send(data).status(200);
        } catch (err) {
            res.send(err).status(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/users', async (req, res) => {
    
    const { login, email, password, role } = req.body;
    
    const newUser = new User({
        login: login,
        email: email,
        password: password,
        avaImage: "https://yt3.googleusercontent.com/ytc/AIf8zZTOqVAj1luCxSiohOyyV5yKwi0DDFy6PruvGoCEeg=s900-c-k-c0x00ffffff-no-rj",
        role: role,
        reviews: [],
        cart: [],
    });
    
    try {
        await newUser.save();
        req.session.username = newUser.login;
        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

app.delete('/users', async (req, res) => {
    const login = req.query.login;
    if(req.session.username == login) {
        try {
            await User.deleteOne({login: login});
            res.sendStatus(201);
        } catch {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(404);
    }
});

app.get('/session', async (req, res) => {
    if(req.session.username) {
        let user = await User.findOne({login: req.session.username});
        if(user) {
            res.send(user).status(200);
        } else {
            res.sendStatus(400);
        }
    }
});

app.get('/check', async (req, res) => {
    if(req.session.username) {
        const login = req.query.login;
        if(req.session.username === login) {
            res.send(true).status(200);
        } else {
            res.send(false).status(200);
        }
    } else {
        res.send(false).status(400);
    }
});

app.get('/logout', async (req, res) => {
    if(req.session.username) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.put('/users', async (req, res) => {
    const { id, login, email, role, avaImage } = req.body;
    
    let user = await User.findOne({_id: id});
    
    user.login = login;
    user.email = email;
    user.role = role;
    if(avaImage) {
        user.avaImage = avaImage;
    }
    
    try {
        await user.save();
        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

app.put('/reviews', async (req, res) => {
    const { comment, raiting, login } = req.body;
    
    let userSession = await User.findOne({login: req.session.username});
    
    if(login != req.session.username) {
        let user = await User.findOne({login: login});
        
        user.reviews.push({
            user: {
                login: userSession.login,
                avaImage: userSession.avaImage,
            },
            comment: comment,
            raiting: raiting,
        });
        
        try {
            await user.save();
            res.sendStatus(201);
        } catch {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(401);
    }
});

app.put('/delete-review', async (req, res) => {
    const { login, id } = req.body;
    
    let userReview = await User.findOne({login: login});
    
    let indexReview = userReview.reviews.findIndex((e) => e._id == id);

    userReview.reviews.splice(indexReview, 1)
    
    try {
        await userReview.save();
        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

// Корзина товаров

app.get('/cart', async (req, res) => {
    // if(req.session.username) {
        const user = await User.findOne({login: 'test'});
        res.send(user.cart).status(200);
    // } else {
        // res.sendStatus(404);
    // }
});

app.put('/cart-post', async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({login: req.session.username});

    const product = await Product.findOne({_id: id})

    try {
        user.cart.push({
            idProduct: id,
            title: product.title,
            description: product.description,
            price: product.price,
            author: product.author,
            isHotel: product.isHotel,
            city: product.city,
            raiting: product.raiting,
            images: product.images,
            phoneNumber: product.phoneNumber,
            places: product.places,
            authorId: product.authorId,
        });
        await user.save();
        res.sendStatus(201);
    } catch {
        res.sendStatus(400); 
    }
});

app.put('/cart-delete', async (req, res) => {
    const { id } = req.body;
    
    const user = await User.findOne({login: req.session.username});
    
    const indexCart = user.cart.findIndex((e) => e.idProduct == id);

    user.cart.splice(indexCart, 1)
    
    try {
        await user.save();
        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

app.get('/in-session', async (req, res) => {
    if(req.session.username) {
        res.send(true).status(200);
    } else {
        res.send(false).status(400);
    }
});