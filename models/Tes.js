const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true //untuk melakukan validasi
    }
})

module.exports = mongoose.model('Test', TestSchema)