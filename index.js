const express = require('express');
const app = express();
const cors = require('cors');
const port = 3005;
const session = require('express-session');
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require('path');

let corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(cookieParser());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use(session({
    secret: "6iKfU6KQQqPf4GhPkV1852",
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
        // min: 1,
        // max: 5,
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
    if(id.length == 24) {
        let user = await User.findOne({_id: id});
        if(user && user.email != ``) {
            let data = await Product.find({authorId: user._id});
            if(data) { 
                try {
                    res.send(data).status(200);
                } catch (error) {
                    res.send(error).status(400);
                }
            } else {
                res.send('Товаров не найдено').status(200);
            }
        } else {
            res.sendStatus(404);
        }
    }
});

app.post('/products', async (req, res) => {
    const { title, description, price, isHotel, city, phoneNumber, places, images } = req.body;
    const { login, _id, grade } = await User.findOne({email: req.session.username});

    let convertedImages = [];

    if(images && images.length > 0) {
        for(let i = 0; i < images.length; i++) {
            let avaImage = images[i];
            const base64String = avaImage.replace(/^data:.+;base64,/, '');
            const buffer = Buffer.from(base64String, 'base64');
            const fileVerse = avaImage.substring("data:image/".length, avaImage.indexOf(";base64"));
            const filePath = path.join(__dirname, 'public', `${_id}_${places}_product${[i]}.${fileVerse}`);
        
            try {
                await fs.promises.writeFile(filePath, buffer);
                convertedImages.push(`http://localhost:3005/${_id}_${places}_product${[i]}.${fileVerse}`);
            } catch (error) {
                console.log(error)
            }
        }
    }

    if(_id) {
        const product = new Product({
            title, description, price, isHotel, city, phoneNumber, places,
            images: convertedImages,
            author: login,
            authorId: _id,
            raiting: grade
        });

        try {
            await product.save();
            res.sendStatus(201);
        } catch(err) {
            res.sendStatus(400);
            console.log(err);
        }
    } else {
        res.sendStatus(400);
    }
});

app.delete('/products', async (req, res) => {
    const id = req.query.id;

    try {
        const user = await User.findOne({ email: req.session.username });
        const product = await Product.findOne({ _id: id });

        if (!user || !product) {
            return res.sendStatus(404);
        }

        if (user._id.toString() !== product.authorId.toString()) {
            return res.sendStatus(403);
        }

        for (let i = 0; i < product.images.length; i++) {
            let fileName = product.images[i].substring('http://localhost:3005/'.length);
            const filePath = path.join(__dirname, 'public', fileName);
        
            console.log(`Попытка удалить файл: ${filePath}`);
        
            try {
                await fs.promises.access(filePath);
                await fs.promises.unlink(filePath);
                console.log(`Файл ${filePath} успешно удален.`);
            } catch (error) {
                console.error(`Ошибка при удалении файла ${filePath}:`, error);
                return res.sendStatus(400);
            }
        }

        await Product.deleteOne({ _id: id });
        res.sendStatus(202);

    } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
        res.sendStatus(500);
    }
});

app.put('/products', async (req, res) => {
    const { id, title, description, price, isHotel, city, phoneNumber, places, images } = req.body;
    let product = await Product.findOne({_id: id});

    const { _id } = await User.findOne({email: req.session.username});

    let convertedImages = [];
    
    if(product && _id && _id == product.authorId) {

        if(images && images.length > 0) {
            for(let i = 0; i < images.length; i++) {
                let avaImage = images[i];
                const base64String = avaImage.replace(/^data:.+;base64,/, '');
                const buffer = Buffer.from(base64String, 'base64');
                const fileVerse = avaImage.substring("data:image/".length, avaImage.indexOf(";base64"));
                const filePath = path.join(__dirname, 'public', `${_id}_${places}_productUpd${[i]}.${fileVerse}`);
        
                try {
                    await fs.promises.writeFile(filePath, buffer);
                    convertedImages.push(`http://localhost:3005/${_id}_${places}_productUpd${[i]}.${fileVerse}`);
                } catch (error) {
                    console.log(error)
                }
            }
        }

        if(_id) {
            product.title = title;
            product.description = description;
            product.price = price;
            product.isHotel = isHotel;
            product.city = city;
            product.phoneNumber = phoneNumber;
            product.places = places;
            if(convertedImages.length != 0) {
                product.images = convertedImages;
            }
        }
    }


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
    
    try {
        const data = await Product.findOne({_id: id});
        res.send(data).status(200);
    } catch {
        res.sendStatus(404);
    }
});

app.put('/place-on-product', async (req, res) => {
    const { id, places } = req.body;

    const product = await Product.findOne({ _id: id });

    product.places = places;

    try {
        await product.save();
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(401);
        console.log(error)
    }
});

//Вход пользователей и их регистрация

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 24,
    },
    avaImage: String,
    role:{
        type: String,
        required: true,
    },
    about: String,
    grade: Number,
    reviews: [{
        user: {
            type: Object,
            required: true,
        },
        comment: {
            type: String, 
            required: true,
            min: 3,
            max: 500,
        },
        raiting: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        }
    }],
    cart: [{
        idProduct: {
            type: String,
            required: false,
            // unique: true
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
            required: false,
        },
    }],
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

app.get('/users', async (req, res) => {
    let data = await User.find();
    for(let i = 0; i < data.length; i++) {
        data[i].email = 'secret, bro)';
        data[i].password = 'also secret, bro)';
    }
    res.send(data).status(200);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const data = await User.findOne({email: email});
    if(data) {
        if(data.password == password) {
            try {
                req.session.username = email;
                res.sendStatus(200); 
            } catch(err) {
                console.log(err);
            } 
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get('/user', async (req, res) => {
    const { id } = req.query;
    let data;
    if(id.length == 24) {
        const user = await User.findOne({_id: id});
        if(user) {
            data = user;
            data.password = ``;
        }
    } else if(id == 'not') {
        const user = await User.findOne({email: req.session.username});
        if(user) {
            data = user;
            data.password = ``;
        }
    } else {
        res.sendStatus(404);
    }

    // if(data && data.reviews.length != 0) {
    //     data.reviews.forEach(e => {
    //         data.grade += (e.raiting / data.reviews.length);
    //     });
    // }
    
    try {
        res.send(data).status(200);
    } catch (err) {
        res.sendStatus(400);
        console.error(err);
    }
});

app.post('/users', async(req, res) => {
    const { login, email, password, role } = req.body;
    
    const newUser = new User({
        login: login,
        email: email,
        password: password,
        avaImage: "https://yt3.googleusercontent.com/ytc/AIf8zZTOqVAj1luCxSiohOyyV5yKwi0DDFy6PruvGoCEeg=s900-c-k-c0x00ffffff-no-rj",
        role: role,
        reviews: [], 
        cart: [],
        grade: 0
    });
    
    try {
        await newUser.save();
        req.session.username = email;
        res.sendStatus(201);
    } catch(error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete('/users', async (req, res) => {
    const email = req.query.email;
    if(req.session.username == email) {
        try {
            await User.deleteOne({email: email});
            res.sendStatus(201);
        } catch {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(404);
    }
});

app.get('/session', async (req, res) => {
    if(req.session.username != undefined) {
        let user = await User.findOne({email: req.session.username});
        if(user) {
            user.password = '';
            res.send(user).status(200);
        } else {
            res.sendStatus(400); 
        }
    }
});

app.get('/check', async (req, res) => {
    if(req.session.username) {
        const { id } = req.query;
        if(id.length == 24) {
            const user = await User.findOne({_id: id})
            if(user && user.email != ``) {
                if(req.session.username == user.email) {
                    res.send({isCreator: 'you'}).status(200);
                } else {
                    res.send({isCreator: 'not'}).status(200);
                }
            } else {
                res.send({isCreator: 'not'}).status(400);
            }
        }
    } else {
        res.send({isCreator: 'not'}).status(400);
    }
});

app.post('/logout', async (req, res) => {
    if(req.session.username) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.put('/users', async (req, res) => {
    const { login, email, role, about, avaImage } = req.body;
    
    let user = await User.findOne({email: req.session.username});
    
    user.login = login;
    user.email = email;
    user.role = role;
    user.about = about;
    if(typeof avaImage === 'string') {
        const base64String = avaImage.replace(/^data:.+;base64,/, '');
        const buffer = Buffer.from(base64String, 'base64');
        const fileVerse = avaImage.substring("data:image/".length, avaImage.indexOf(";base64"))
        const filePath = path.join(__dirname, 'public', user._id + `.${fileVerse}`);

        try {
            await fs.promises.writeFile(filePath, buffer);
            user.avaImage = `http://localhost:3005/${user._id}.${fileVerse}`;
        } catch (error) {
            console.log(error)
        }
    }
    
    try {
        await user.save();
        res.sendStatus(201);
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.put('/reviews', async (req, res) => {
    const { comment, raiting, id, idProfile } = req.body;
    
    let userSession = await User.findOne({email: req.session.username});
    let user = await User.findOne({_id: id});
    let product = await Product.find({ authorId: id });
    
    if(idProfile != user._id) {
        if(user.email != req.session.username) {
            user.reviews.push({
                user: {
                    login: userSession.login,
                    avaImage: userSession.avaImage,
                    idProfile: idProfile,
                },
                comment: comment,
                raiting: raiting,
            });
            user.grade = user.grade + Number(raiting);

            try {
                await user.save();

                product.forEach(async (e) => {
                    e.raiting = user.grade / user.reviews.length;
                    await e.save();
                });

                res.sendStatus(201);
            } catch(e) {
                res.sendStatus(400);
                console.log(e);
            }
        } else {
            res.sendStatus(401);
        }
    }
});

app.put('/delete-review', async (req, res) => {
    const { idReview, idProfile } = req.body;
    
    let userReview = await User.findOne({_id: idProfile});

    let userProducts = await Product.find({ authorId: idProfile });
    
    let indexReview = userReview.reviews.findIndex((e) => e._id == idReview);

    userReview.grade = userReview.grade - Number(userReview.reviews[indexReview].raiting);
    
    userReview.reviews.splice(indexReview, 1);
    
    try {
        await userReview.save();

        userProducts.forEach(async (e) => {
            e.raiting = userReview.grade / userReview.reviews.length;
            await e.save();
        });

        res.sendStatus(201);
    } catch {
        res.sendStatus(400);
    }
});

// Корзина товаров

app.get('/cart', async (req, res) => {
    if(req.session.username) {
        const user = await User.findOne({email: req.session.username});
        res.send(user.cart).status(200);
    } else {
        res.sendStatus(404);
    }
});

app.put('/cart-post', async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({email: req.session.username});

    const product = await Product.findOne({_id: id});

    let newProduct = {
        idProduct: product._id,
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
    }

    if(user && product) {
        if(user.cart.length > 0) {
            for(let i = 0; i < user.cart.length; i++) {
                let idProduct = user.cart[i].idProduct;
                if(idProduct !== id && idProduct != newProduct.idProduct) {
                    console.log(idProduct, id);
                    user.cart.push(newProduct); 
                }
            };
        } else {
            user.cart.push(newProduct); 
        }

        try {
            await user.save(); 
            res.sendStatus(201);
        } catch(e) {
            res.sendStatus(400); 
            console.error(e);
        }
    } else {
        res.sendStatus(404); 
    }
});

app.put('/cart-delete', async (req, res) => {
    const { id } = req.body;
    
    const user = await User.findOne({email: req.session.username});
    
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