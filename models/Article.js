const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true, // ✅ Corregido: `require` → `required`
    },
    content: {
        type: String,
        required: true, // ✅ Corregido: `require` → `required`
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        default: 'default.png',
    },
});

module.exports = model('Article', ArticleSchema, 'articles');
