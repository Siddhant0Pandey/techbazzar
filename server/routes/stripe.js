import express from 'express';
import Stripe from 'stripe';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
});

// Create checkout session
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { price_id, mode, success_url, cancel_url } = req.body;
    const user = req.user;

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user._id.toString(),
          },
        });
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create customer',
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message,
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      
      // TODO: Update your MongoDB database with subscription/order information
      // You can access the customer ID and other details from the session object
      
      break;
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      
      // TODO: Update your MongoDB database with subscription information
      
      break;
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      
      // TODO: Update your MongoDB database with updated subscription information
      
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription deleted:', deletedSubscription.id);
      
      // TODO: Update your MongoDB database to mark subscription as cancelled
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;