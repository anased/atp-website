// src/pages/membership.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Membership() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = '/auth/signin?callbackUrl=/membership';
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Membership | ATP Medical Education</title>
        <meta name="description" content="Join our premium membership for full access to all medical education resources" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Membership Plans</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Free Access</h2>
                <p className="text-gray-600 mt-1">Basic access to our educational content</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access to all YouTube videos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interactive case simulators</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500">Premium downloads</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-bold mb-4">$0</p>
                {!session ? (
                  <Link 
                    href="/auth/signup" 
                    className="inline-block w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Sign Up
                  </Link>
                ) : (
                  <span className="inline-block w-full py-2 bg-gray-100 text-gray-500 rounded">
                    Current Plan
                  </span>
                )}
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                Recommended
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Premium Access</h2>
                <p className="text-gray-600 mt-1">Complete access to all educational resources</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access to all YouTube videos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interactive case simulators</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Premium downloads</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Anki decks and PDFs</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-bold mb-4">$9.99<span className="text-base font-normal text-gray-600">/month</span></p>
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="inline-block w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-75"
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What's included in the premium membership?</h4>
                <p className="text-gray-600 mt-1">Premium members get access to all downloadable resources including Anki decks, PDFs, and other exclusive materials.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Can I cancel my subscription?</h4>
                <p className="text-gray-600 mt-1">Yes, you can cancel your subscription at any time from your account page. You'll continue to have access until the end of your billing period.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Is there a student discount?</h4>
                <p className="text-gray-600 mt-1">We offer student discounts with valid ID. Please contact us for more information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}