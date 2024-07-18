const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { orderService } = require('./services');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// stripe webhoook start
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPONT;

app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      try {
        // console.log(event.type);

        const { invoice, metadata, payment_intent: paymentIntent, payment_status: paymentStatus } = event.data.object;

        // create order
        const orderBody = {
          invoice,
          metadata,
          paymentIntent,
          paymentStatus,
        };

        const order = await orderService.createOrder(orderBody);


        // create transaction
        const transactionBody = {
          user: metadata.user,
          order: order.id,
          amount: metadata.totalAmount,
          transactionType: 'Payment',
          status: paymentStatus === 'paid' ? 'Completed' : 'Pending',
          paymentMethod: 'card',
          transactionId: paymentIntent,
        };

        await orderService.createTransaction(transactionBody);

        //  send invoice in email
      } catch (error) {
        console.error('Error while saving orders', error);
      }
      break;

    // ... handle other event types
    default:
    // console.log(`Unhandled event type ${event.type}`);
    // console.log(event.data.object);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// stripe webhoook ends

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
