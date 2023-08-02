const jwt = require('jsonwebtoken');

const productDetails = require('./../models/productModel');


const verifyToken = async (tokenObj) => {
    const token = tokenObj.slice(8);

    if (!token) {
        return ({
            success: 'fail',
            message: 'token not received'
        })
    }
    else {
        try {
            const result = await jwt.verify(token, process.env.JWT_KEY);
            return ({
                success: 'pass',
                message: 'user successfully login'
            })
        }
        catch (err) {
            return ({
                success: 'fail',
                message: 'user failed, please login again'
            })
        }
    }
}

const addProduct = async (newProductDetails) => {
    try {
        const result = await verifyToken(newProductDetails.token);
        if (result.success) {
            const { product_name, logo_url, product_link, product_description, product_category } = newProductDetails;
            const likes = 0;
            const total_comments = 0;
            const newProduct = new productDetails({
                product_name, logo_url, product_link, product_description, product_category, likes, total_comments
            })
            const saveProduct = await newProduct.save();
            return ({
                success: 'pass',
                message: 'product added successfully'
            })
        }
        else {
            return ({
                success: 'fail',
                message: result.message
            })
        }
    }
    catch (err) {
        return ({
            success: 'fail',
            message: 'Please try again your product is not added successfully!'
        })
    }
}

const getProducts = async (query, userSort) => {
    let sort = userSort;
    if (!userSort) {
        sort = { _id: -1 };
    }
    else if (sort == 'likes') {
        sort = { likes: -1 }
    }
    else if (sort == 'comments') {
        sort = { total_comments: -1 }
    }
    if (!query) {
        const result = await productDetails.find().sort(sort);
        return {
            success: 'pass',
            data: result
        };
    }
    else {
        try {
            const result = await productDetails.find({
                'product_category': {
                    $in: [query]
                }
            }).sort(sort);
            return ({
                success: 'pass',
                data: result
            })
        }
        catch (err) {
            return ({
                success: 'fail',
                message: 'Could not fetch products, try again'
            });
        }
    }
}

const addLike = async (productObj) => {
    const { productId } = productObj;
    try {
        const result = await productDetails.updateOne(
            { _id: productId },
            {
                $inc: { likes: 1 }
            }
        )
        return ({
            success: 'pass',
            message: 'like added successfully'
        })
    }
    catch (err) {
        return ({
            success: 'fail',
            message: 'Please try again like is not added successfully!'
        })
    }
}

const addComment = async (productObj) => {
    const { productId, comment } = productObj;

    try {
        const result = await productDetails.updateOne(
            { _id: productId },
            {
                $inc: { total_comments: 1 },
                $push: { comments: comment }
            }
        )
        return ({
            success: 'pass',
            message: 'Comment added successfully'
        });
    }
    catch (err) {
        return ({
            success: 'fail',
            message: 'Please try again your comment is not added successfully!'
        })
    }


}

module.exports = {
    addProduct,
    getProducts,
    addComment,
    addLike,
}
