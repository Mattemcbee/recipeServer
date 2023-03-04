const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true
});

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    ingredients: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        min: 1,
        required: true
    },
    calories: {
        type: Number,
        min: 1,
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    comments: [commentSchema]

}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;