const mongoose = require('mongoose');
const { token } = require('morgan');
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim:true
    },
    duration:{
      type:Number,
      required:[true,'a tour must have duration']
    },
    maxGroupSize:{
      type:Number,
      required:[true,'a tour must have group']
    },
    ratingsAverage: {
      type: Number,
      default: 4.45
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true,
      required:[true,'a tour must have a description']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type :String,
      required:[true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now()
    },
    startDates:[Date]
  });
  
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports=Tour