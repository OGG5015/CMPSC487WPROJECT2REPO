const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    itemColor: {
        type: String,
        required: true
    },
    itemCondition: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
});

const ItemModel = mongoose.model("items", ItemSchema)
module.exports = ItemModel;