const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true //untuk melakukan validasi
    },
    itemId:[{
        type: ObjectId, // untuk menangkap relasi dari model item
        ref: 'Item'
    }]
})

module.exports = mongoose.model('Category', categorySchema)


