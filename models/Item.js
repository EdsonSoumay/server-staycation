const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true //untuk melakukan validasi
      },
      price: {
        type: Number,
        required: true
      },
      country: {
        type: String,
        default: 'Indonesia'
      },
      city: {
        type: String,
        required: true
      },
      isPopular: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        default: 'night'
      },
      sumBooking: {
        type: Number,
        default: 0
      },
      categoryId: {
        type: ObjectId,
        ref: 'Category' // referensi/berelasi dengan category
      },
      imageId: [{
        type: ObjectId,
        ref: 'Image' // referensi dari/kedalam image
      }],
      featureId: [{
        type: ObjectId,
        ref: 'Feature'
      }],
      activityId: [{
        type: ObjectId,
        ref: 'Activity'
      }]
})

module.exports = mongoose.model('Item', itemSchema)