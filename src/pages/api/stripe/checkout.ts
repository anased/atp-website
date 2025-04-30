// src/pages/api/stripe/checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { stripe } from '../../../lib/stripe';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { membership: true }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    let customerId = user.membership?.stripeCustomerId;
    
    if (!customerId) {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID
      await prisma.membership.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          stripeCustomerId: customerId,
          active: false
        }
      });
    }
    
    // Create Stripe checkout session
    const priceId = process.env.STRIPE_PRICE_ID; // Make sure to create a price in Stripe dashboard and add its ID to env
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID not configured' });
    }
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/account/membership?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/account/membership?canceled=true`,
    });
    
    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}