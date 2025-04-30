// src/pages/account/membership.tsx
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

interface MembershipData {
  active: boolean;
  currentPeriodEnd: string | null;
}

interface AccountMembershipProps {
  membershipData: MembershipData | null;
}

export default function AccountMembership({ membershipData }: AccountMembershipProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Check URL params for success
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('success') === 'true') {
      setSuccess(true);
    }
  }, []);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleManageSubscription = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Manage Membership | ATP Medical Education</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Manage Your Membership</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
              <p className="font-medium">Thank you for your subscription!</p>
              <p>Your premium access is now active.</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4">Subscription Status</h2>
            
            {membershipData?.active ? (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">Premium Membership</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renews on</span>
                    <span className="font-medium">{formatDate(membershipData.currentPeriodEnd)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-75"
                >
                  {isLoading ? 'Loading...' : 'Manage Subscription'}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="mb-2">You don't have an active premium subscription.</p>
                  <p className="text-gray-600">Upgrade to premium to access exclusive content and resources.</p>
                </div>
                
                <Link
                  href="/membership"
                  className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Membership Plans
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-6">
            <Link href="/account" className="text-blue-600 hover:text-blue-800">
              ← Back to Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/account/membership',
        permanent: false,
      },
    };
  }
  
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id as string },
  });
  
  const membershipData = membership && membership.active
    ? {
        active: true,
        currentPeriodEnd: membership.currentPeriodEnd?.toISOString() || null,
      }
    : { active: false, currentPeriodEnd: null };
  
  return {
    props: {
      membershipData,
    },
  };
};