const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl:{
        type: String,
        required: true //untuk melakukan validasi
    }
})

module.exports = mongoose.model('Image', imageSchema)