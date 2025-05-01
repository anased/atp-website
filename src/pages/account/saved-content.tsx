// src/pages/account/saved-content.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { authOptions } from '../api/auth/[...nextauth]';

// For now, we'll implement a placeholder page for saved content
// In a real application, you would need to track user bookmarks in the database
// This requires adding a new model to the Prisma schema

interface SavedContentPageProps {
  // In a real implementation, this would contain actual saved content
  // For now, we'll use placeholder data
  savedVideos: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    savedAt: string;
  }>;
}

export default function SavedContentPage({ savedVideos }: SavedContentPageProps) {
  const [videos, setVideos] = useState(savedVideos);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleRemoveBookmark = (videoId: string) => {
    // In a real implementation, this would call an API endpoint to remove the bookmark
    // For now, we'll just update the local state
    setVideos(videos.filter(video => video.id !== videoId));
  };

  return (
    <Layout>
      <Head>
        <title>Saved Content | ATP Medical Education</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/account" className="text-blue-600 hover:text-blue-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Saved Content</h1>
          </div>
          
          {videos.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {videos.map((video) => (
                  <li key={video.id} className="relative">
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
                      <div className="flex-grow pr-8">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Saved on {formatDate(video.savedAt)}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(video.id)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                      aria-label="Remove bookmark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved content yet</h3>
              <p className="text-gray-500 mb-4">
                Save videos for quick access by clicking the bookmark icon when watching them.
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
        destination: '/auth/signin?callbackUrl=/account/saved-content',
        permanent: false,
      },
    };
  }
  
  // In a real implementation, you would fetch the actual saved content from your database
  // For now, we'll use placeholder data
  
  // Placeholder data
  const savedVideos = [
    {
      id: '1',
      title: 'ECG Interpretation: Complete Guide',
      slug: 'ecg-interpretation-guide',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: '2',
      title: 'Neurological Examination Techniques',
      slug: 'neurological-examination-techniques',
      thumbnailUrl: 'https://img.youtube.com/vi/xvFZjo5PgG0/mqdefault.jpg',
      savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      id: '3',
      title: 'Advanced Cardiac Life Support Review',
      slug: 'acls-review',
      thumbnailUrl: 'https://img.youtube.com/vi/QB7ACr7pUuE/mqdefault.jpg',
      savedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    },
  ];
  
  return {
    props: {
      savedVideos,
    },
  };
};