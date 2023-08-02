const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    product_name: String,
    logo_url: String,
    product_link: String,
    product_description: String,
    likes: Number,
    total_comments: Number,
    comments: [],
    product_category: [],

})
module.exports = new mongoose.model("feedbackProduct", productDetailSchema);
