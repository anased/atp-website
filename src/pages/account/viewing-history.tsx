// src/pages/account/viewing-history.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

// For now, we'll implement a placeholder page for viewing history
// In a real application, you would need to track user video views in the database
// This requires adding a new model to the Prisma schema

interface ViewingHistoryPageProps {
  // In a real implementation, this would contain actual history data
  // For now, we'll use placeholder data
  recentVideos: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    watchedAt: string;
  }>;
}

export default function ViewingHistoryPage({ recentVideos }: ViewingHistoryPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your viewing history?')) {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would call an API endpoint to clear the history
        // For now, we'll just simulate the action with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload the page to show empty history
        window.location.reload();
      } catch (error) {
        console.error('Error clearing history:', error);
        alert('Failed to clear viewing history');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Viewing History | ATP Medical Education</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/account" className="text-blue-600 hover:text-blue-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Viewing History</h1>
            </div>
            
            <button
              onClick={handleClearHistory}
              disabled={isLoading || recentVideos.length === 0}
              className="text-sm text-gray-600 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-600"
            >
              {isLoading ? 'Clearing...' : 'Clear History'}
            </button>
          </div>
          
          {recentVideos.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {recentVideos.map((video) => (
                  <li key={video.id}>
                    <Link 
                      href={`/videos/${video.slug}`}
                      className="flex p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 w-32 h-20 relative mr-4">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(video.watchedAt)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-center ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No viewing history yet</h3>
              <p className="text-gray-500 mb-4">
                Videos you watch will appear here so you can easily find them again.
              </p>
              <Link 
                href="/videos"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Videos
              </Link>
            </div>
          )}
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
        destination: '/auth/signin?callbackUrl=/account/viewing-history',
        permanent: false,
      },
    };
  }
  
  // In a real implementation, you would fetch the actual viewing history from your database
  // For now, we'll use placeholder data
  
  // Placeholder data
  const recentVideos = [
    {
      id: '1',
      title: 'Understanding Heart Murmurs: A Clinical Approach',
      slug: 'understanding-heart-murmurs',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      title: 'Respiratory Examination: OSCE Guide',
      slug: 'respiratory-examination-guide',
      thumbnailUrl: 'https://img.youtube.com/vi/xvFZjo5PgG0/mqdefault.jpg',
      watchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '3',
      title: 'Stroke Assessment and Management',
      slug: 'stroke-assessment-management',
      thumbnailUrl: 'https://img.youtube.com/vi/QB7ACr7pUuE/mqdefault.jpg',
      watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ];
  
  return {
    props: {
      recentVideos,
    },
  };
};