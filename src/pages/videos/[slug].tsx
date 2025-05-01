// src/pages/videos/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/layout/Layout';
import VideoPlayer from '../../components/video/VideoPlayer';
import CaseSimulator from '@/components/video/CaseSimulator';
import { createClient } from 'next-sanity';
import PortableText from '../../components/content/PortableText';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

interface VideoPageProps {
  video: {
    _id: string;
    title: string;
    youtubeId: string;
    description?: string;
  };
  caseData: any | null;
  note: any | null;
  downloads: any[];
}

export default function VideoPage({ video, caseData, note, downloads }: VideoPageProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'case' | 'notes' | 'downloads'>(
    caseData ? 'case' : note ? 'notes' : 'downloads'
  );
  
  const isPremium = !!session?.user?.isPremium;
  const hasPremiumDownloads = downloads.some(download => download.isPremium);
  
  return (
    <Layout>
      <Head>
        <title>{video.title} | ATP Medical Education</title>
        <meta name="description" content={video.description || video.title} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        
        
        <div className="relative z-10 bg-white pt-4 pb-4 mb-6">
        {/* Centered video player with medium size */}
        <div className="flex justify-center mb-4">
            <div className="w-full max-w-xl">
            <VideoPlayer
                videoId={video._id}
                youtubeId={video.youtubeId}
            />
            </div>
        </div>
        
        {/* Full-width description */}
        {video.description && (
            <div className="w-full">
            <p className="text-gray-700">{video.description}</p>
            </div>
        )}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Has case data: {caseData ? 'Yes' : 'No'}</p>
        <p>Has note data: {note ? 'Yes' : 'No'}</p>
        <p>Number of downloads: {downloads.length}</p>
        </div>

        {/* And add a fallback when no tabs are available */}
        {!caseData && !note && downloads.length === 0 && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No additional content</h3>
            <p>This video doesn't have any cases, notes, or downloads attached yet.</p>
        </div>
        )}
        {/* Tabs navigation */}
        <div className="border-b border-gray-200 mt-6">
          <div className="flex -mb-px">
            {caseData && (
              <button
                onClick={() => setActiveTab('case')}
                className={`py-3 px-6 font-medium text-sm mr-4 border-b-2 transition-colors duration-200 ${
                  activeTab === 'case'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Case Study
              </button>
            )}
            
            {note && (
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-6 font-medium text-sm mr-4 border-b-2 transition-colors duration-200 ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notes
              </button>
            )}
            
            {downloads.length > 0 && (
              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeTab === 'downloads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Downloads
                {hasPremiumDownloads && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Premium
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Tab content */}
        <div className="py-6">
          {activeTab === 'case' && caseData && (
            <div>
              <CaseSimulator caseData={caseData} />
            </div>
          )}
          
          {activeTab === 'notes' && note && (
            <div>
                <h2 className="text-xl font-semibold mb-4">{note.title}</h2>
                <PortableText content={note.content} />
            </div>
          )}
          
          {activeTab === 'downloads' && (
            <div>
              {/* Free downloads section */}
              {downloads.filter(d => !d.isPremium).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Free Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloads
                      .filter(download => !download.isPremium)
                      .map((download) => (
                        <DownloadCard 
                          key={download._id} 
                          download={download} 
                          isPremiumUser={isPremium} 
                        />
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Premium downloads section */}
              {downloads.filter(d => d.isPremium).length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold">Premium Resources</h2>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  </div>
                  
                  {!isPremium ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <h3 className="text-lg font-medium mb-2">Premium Content</h3>
                      <p className="text-gray-600 mb-4">
                        Upgrade to premium to access these additional resources.
                      </p>
                      <Link 
                        href="/membership" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {downloads
                        .filter(download => download.isPremium)
                        .map((download) => (
                          <DownloadCard 
                            key={download._id} 
                            download={download} 
                            isPremiumUser={isPremium} 
                          />
                        ))
                      }
                    </div>
                  )}
                </div>
              )}
              
              {downloads.length === 0 && (
                <p className="text-gray-500">No downloads available for this video.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

interface DownloadCardProps {
  download: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    description?: string;
    isPremium: boolean;
  };
  isPremiumUser: boolean;
}

function DownloadCard({ download, isPremiumUser }: DownloadCardProps) {
  const canAccess = !download.isPremium || isPremiumUser;
  
  const getFileTypeIcon = () => {
    switch (download.fileType) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z" />
          </svg>
        );
      case 'anki':
        return (
          <svg className="w-8 h-8 text-indigo-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow duration-200">
      <div className="p-4 flex">
        <div className="flex-shrink-0 mr-4">
          {getFileTypeIcon()}
        </div>
        <div className="flex-grow">
          <h3 className="font-medium">{download.title}</h3>
          {download.description && (
            <p className="text-sm text-gray-600 mt-1">{download.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {download.fileType.toUpperCase()} File
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t">
      {canAccess ? (
  
            <a href={download.fileUrl}
            download
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
            <svg className="w-4 h-4 mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z" />
            </svg>
            Download
            </a>
            ) : (
          <div className="flex items-center text-sm text-yellow-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
            </svg>
            Premium content
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(`
    *[_type == "video" && defined(slug.current)].slug.current
  `);
  
  return {
    paths: slugs.map((slug: string) => ({ params: { slug } })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  const video = await client.fetch(`
    *[_type == "video" && slug.current == $slug][0] {
      _id,
      title,
      youtubeId,
      description,
      "caseId": case._ref,
      "noteId": note._ref,
      "downloadIds": downloads[]._ref
    }
  `, { slug });
  
  if (!video) {
    return { notFound: true };
  }
  
  // Fetch related content
  let caseData = null;
  let note = null;
  let downloads = [];
  
  if (video.caseId) {
    caseData = await client.fetch(`
      *[_type == "case" && _id == $id][0] {
        _id,
        title,
        description,
        questions
      }
    `, { id: video.caseId });
  }
  
  if (video.noteId) {
    note = await client.fetch(`
    *[_type == "note" && _id == $id][0] {
      _id,
      title,
      content
    }
  `, { id: video.noteId });
  }
  
  if (video.downloadIds && video.downloadIds.length > 0) {
    downloads = await client.fetch(`
      *[_type == "download" && _id in $ids] {
        _id,
        title,
        "fileUrl": file.asset->url,
        fileType,
        description,
        isPremium
      }
    `, { ids: video.downloadIds });
  }
  
  return {
    props: {
      video,
      caseData,
      note,
      downloads: downloads || []
    },
    revalidate: 60 // ISR: revalidate every minute
  };
};

