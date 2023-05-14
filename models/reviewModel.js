// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: true,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId, //parent referencing
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // keep in mind populate take time to process, two populate around 100ms~
  // we remove populate tour, since its inefficient and since we populate review from tour model its would create chaining (tour->review->tour) that we dont need
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

//DOCUMENT MIDDLEWARE
//post cause we need after the document saved on db to make the operation
reviewSchema.post('save', function() {
  // post middleware doesn't get access to next
  // this POINT to current review doc
  // this.constructor points to the model <=> this.constructor equal to model
  this.constructor.calcAverageRatingsAndUpdate(this.tour);
});

//QUERY MIDDLEWARE
// findByIdAndUpdate - inner function of findOneAndUpdate
// findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) await doc.constructor.calcAverageRatingsAndUpdate(doc.tour);
});

//can be called by model Review.calcStats
reviewSchema.statics.calcAverageRatingsAndUpdate = async function(tourId) {
  //this points on the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    //set to default when is no reviews (stats is empty array)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
