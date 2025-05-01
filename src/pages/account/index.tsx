// src/pages/account/index.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

interface AccountPageProps {
  userData: {
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
    isPremium: boolean;
  };
}

export default function AccountPage({ userData }: AccountPageProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Profile successfully updated!' 
      });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Layout>
      <Head>
        <title>My Account | ATP Medical Education</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p>{message.text}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Account Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  {userData.image ? (
                    <Image 
                      src={userData.image} 
                      alt={userData.name || 'User'} 
                      width={80} 
                      height={80} 
                      className="rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-white">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userData.name || 'User'}</h2>
                  <p className="opacity-90">{userData.email}</p>
                  <p className="text-sm opacity-75 mt-1">Member since {formatDate(userData.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* Membership Status */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Membership Status</h3>
              
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-2 ${
                  userData.isPremium ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="font-medium">
                  {userData.isPremium ? 'Premium Member' : 'Free Account'}
                </span>
                
                <Link 
                  href="/account/membership" 
                  className="ml-auto text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {userData.isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
                </Link>
              </div>
            </div>
            
            {/* Profile Section */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-75"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(userData.name || '');
                        setMessage({ type: '', text: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{userData.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{userData.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/account/membership" 
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Membership</h3>
              <p className="text-sm text-gray-600">Manage your subscription</p>
            </Link>
            
            <Link 
              href="/account/viewing-history" 
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Viewing History</h3>
              <p className="text-sm text-gray-600">See your watched videos</p>
            </Link>
            
            <Link 
              href="/account/saved-content" 
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Saved Content</h3>
              <p className="text-sm text-gray-600">Access your bookmarks</p>
            </Link>
          </div>
          
          {/* Additional options */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Account Options</h3>
            
            <div className="space-y-3">
              <Link 
                href="/account/change-password" 
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </Link>
              
              <Link 
                href="/account/notifications" 
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notification Settings
              </Link>
            </div>
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
        destination: '/auth/signin?callbackUrl=/account',
        permanent: false,
      },
    };
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { membership: true }
  });
  
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  // Format user data for frontend
  const userData = {
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
    isPremium: !!user.membership?.active,
  };
  
  return {
    props: {
      userData,
    },
  };
};