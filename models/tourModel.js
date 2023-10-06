const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, //removes spaces at the start and the end of the string "---abc abcc--"
      maxlength: [
        40,
        'A tour name must have less then or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more then or equal to 10 characters'
      ]
      // ,
      // validate: [validator.isAlpha, 'Tour name must only contain characters'] //its failed on spaces too so we comment it out.
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'], //just shorthand of the object line below 👇
      enum: {
        //only for strings
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      } //complete object and not the shorthand cause multiple values
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      //set will run each time that new value is set for this field
      set: val => Math.round(val * 10) / 10 //Trick to round deciaml - 4.66666, 46.6666 , 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    priceDiscount: {
      type: Number,
      validate: {
        //💥 this keyword only point to current doc on NEW document creation(e.g. not going to works on update query)
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price' //trick to access to the value in mongoose
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },

    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 }); //Create index for price property in ascending order makes mongoose engine much faster in queries that scan with price property e.g., {{URL}}api/v1/tours?price[lt]=1000
tourSchema.index({ price: 1, ratingsAverage: -1 }); //Compund index
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); //telling mongodb that startlocation should be index to 2dsphere

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7; //covert the duration in days to weeks
});

// Virtual populate, since we dont want to keep an array of child referencing at the tour document, instead we populate only in get 1 tour route
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // field in review schema that referencing to tour
  localField: '_id'
});

//DOCUMENT MIDDLEWARE: runs before .save() and .created()
tourSchema.pre('save', function(next) {
  //this point to document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });// if we want to embedded guides to tour, but its not ideal, therefore we referecing instead

// //Document middleware that runs after(post) .save() and .created() in DB
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE: only runs for find query(not findOne)
// tourSchema.pre('find', function(next) {
//   //this point to query object(i guess like apiFeatures.js that we made)
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

////QUERY MIDDLEWARE: runs for find and findOne queries(all queries that start with find keyword)
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } }); //exclude tours with  secretTour set to true
  this.start = Date.now(); //query execute start time
  next();
});

tourSchema.pre(/^find/, function(next) {
  //populating
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`); //time took to execute the current query
//   // console.log(docs);
//   next();
// });

//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   //this point to aggregation object
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } }
//   });
//   // console.log(this.pipeline()); // the array that we pass to aggregate in the controller
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
