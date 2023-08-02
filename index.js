const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');


app.get('/', (req, res) => {
    res.send('Backend working');
});


app.post('/user/register', async (req, res) => {
    const { registerUser } = userController;
    const result = await registerUser(req.body);
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }

});


app.post('/user/login', async (req, res) => {
    const { loginUser } = userController;
    const result = await loginUser(req.body);
    if (result.success) {
        res.send({
            success: 'pass',
            token: result.token
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});


app.post('/product/add', async (req, res) => {
    let token = req.headers.authorization;
    const { product_name, logo_url, product_link, product_description, product_category } = req.body;

    const { addProduct } = productController;

    const result = await addProduct({
        token, product_name, logo_url, product_link, product_description, product_category
    });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.get('/product/view', async (req, res) => {
    const { sort, product_category } = req.query;
    const { getProducts } = productController;

    const result = await getProducts(product_category, sort);
    if (result.success) {
        res.send({
            success: 'pass',
            data: result.data
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.patch('/product/comment/:id', async (req, res) => {
    const productId = req.params.id;
    const comment = req.body.comment;
    const { addComment } = productController;

    const result = await addComment({ productId, comment });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.patch('/product/like/:id', async (req, res) => {
    const productId = req.params.id;
    const { addLike } = productController;
    const result = await addLike({ productId });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        })
    } else {
        res.status(400).send({
            success: 'fail',
            message: result.message
        })
    }
})

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("Server is running on http://localhost:3000"))
        .catch((error) => console.log(error))

});
