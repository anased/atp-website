// src/pages/api/stripe/portal.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { stripe } from '../../../lib/stripe';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { membership: true }
    });
    
    if (!user?.membership?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.membership.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/account/membership`,
    });
    
    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}