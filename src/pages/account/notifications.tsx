// src/pages/account/notifications.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { authOptions } from '../api/auth/[...nextauth]';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationsPageProps {
  // In a real implementation, this would be fetched from the user's preferences
  // For now, we'll use default settings
  initialSettings: NotificationSetting[];
}

export default function NotificationsPage({ initialSettings }: NotificationsPageProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleToggle = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real implementation, this would call an API endpoint to save the settings
      // For now, we'll just simulate the action with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: 'Notification preferences saved successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to save notification preferences' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Notification Settings | ATP Medical Education</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/account" className="text-blue-600 hover:text-blue-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Notification Settings</h1>
          </div>
          
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
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-2">Email Notifications</h2>
              <p className="text-gray-600 text-sm">
                Choose which emails you'd like to receive from ATP Medical Education.
              </p>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {settings.map((setting) => (
                <li key={setting.id} className="p-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={setting.id}
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => handleToggle(setting.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor={setting.id} className="font-medium text-gray-800">
                        {setting.name}
                      </label>
                      <p className="text-gray-600 text-sm mt-1">{setting.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-6 bg-gray-50">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-75"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
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
        destination: '/auth/signin?callbackUrl=/account/notifications',
        permanent: false,
      },
    };
  }
  
  // In a real implementation, you would fetch the user's notification preferences
  // For now, we'll use default settings
  
  // Default settings
  const initialSettings = [
    {
      id: 'new-content',
      name: 'New Content Notifications',
      description: 'Get emails when we publish new videos, cases, or notes related to your interests.',
      enabled: true,
    },
    {
      id: 'product-updates',
      name: 'Product Updates',
      description: 'Receive updates about new features, improvements, and changes to our platform.',
      enabled: true,
    },
    {
      id: 'promotions',
      name: 'Promotional Emails',
      description: 'Special offers, discounts, and promotional announcements.',
      enabled: false,
    },
    {
      id: 'membership',
      name: 'Membership Reminders',
      description: 'Reminders about your membership status and renewal.',
      enabled: true,
    },
    {
      id: 'newsletter',
      name: 'Educational Newsletter',
      description: 'Monthly newsletter with educational content and medical learning resources.',
      enabled: true,
    },
  ];
  
  return {
    props: {
      initialSettings,
    },
  };
};