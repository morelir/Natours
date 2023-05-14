const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // path.join will take care of unneccessary delimiters, that may occur if the given pathes come from unknown sources

const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/',
  'https://*.stripe.com',
  'https:',
  'data:'
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
  'https:'
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com/',
  'http://127.0.0.1:3000'
];
const fontSrcUrls = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'https:',
  'data:'
];
const frameSrcUrls = ['https://*.stripe.com'];

app.use(
  helmet({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'data:', 'blob:'],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      childSrc: ["'self'", 'blob:'],
      frameSrc: ["'self'", ...frameSrcUrls],
      upgradeInsecureRequests: []
    }
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API, help us to prevent DENIAL-SERVICE(DOS) ATTACK and BRUTE FORCE ATTACKS
const limiter = rateLimit({
  max: 100, // allow 100 request from same ip
  windowsMsL: 60 * 60 * 1000, // per hour,
  message: 'Too many requests from this IP,please try again in an hour!' // error message
});
app.use('/api', limiter); // effect all of the routes start with '/api'

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //limiting data size
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // we need that middleware to basicly parse data coming from urlencoded form, ,extended property let sending more complex data
app.use(cookieParser());

// Data senitization against NoSQL query injection // e.g., req.body property for  login route - "email":{ "$gt":"" }
app.use(mongoSanitize()); // basicly removing $ sign from req.body,req.query,req.params

// Data senitization against XSS // e.g., property in sign-in route "name":<div id='bad-code'> Name<div>
app.use(xss()); // basicly clean every user input from malicious html code

// Prevent parameter pollution // e.g., tours?sort=duration&sort=price - in this example sort holding array instead of string, and will throw error in sort method cause we excpect a string in sort field
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ] // params that excluded // e.g., tours?duration=5&duration=9 - we want this query string to occure
  })
); // basicly clean up the query string (in the example will use the last sort param)

app.use(compression()); // compress all the text that send to the client

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  //  new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  next(err);
});

//Global Error Middleware
app.use(globalErrorHandler);

module.exports = app;
