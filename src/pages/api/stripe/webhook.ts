// src/pages/api/stripe/webhook.ts
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '../../../lib/stripe';
import { prisma } from '../../../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  
  // Handle subscription events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscription(subscription);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await cancelSubscription(deletedSubscription);
      break;
  }
  
  res.status(200).end();
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  
  const membership = await prisma.membership.findFirst({
    where: { stripeCustomerId: customerId }
  });
  
  if (!membership) {
    console.error(`No membership found for Stripe customer: ${customerId}`);
    return;
  }
  
  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      active: status === 'active' || status === 'trialing',
      stripeSubscriptionId: subscription.id,
      // Use type assertion to access the property:
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
    }
  });
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const membership = await prisma.membership.findFirst({
    where: { stripeCustomerId: customerId }
  });
  
  if (!membership) {
    console.error(`No membership found for Stripe customer: ${customerId}`);
    return;
  }
  
  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      active: false
    }
  });
}