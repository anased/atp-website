// src/pages/search.tsx
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import VideoGrid from '../components/video/VideoGrid';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

interface SearchPageProps {
  initialResults: any[];
  query: string;
}

export default function SearchPage({ initialResults, query }: SearchPageProps) {
  const router = useRouter();
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update results when query changes
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      
      const fetchResults = async () => {
        const searchQuery = `*[_type == "video" && (title match $searchTerm || description match $searchTerm)] {
          _id,
          title,
          "slug": slug.current,
          youtubeId,
          description
        }`;
        
        const searchResults = await client.fetch(searchQuery, { 
          searchTerm: `*${query}*` 
        });
        
        setResults(searchResults);
        setIsLoading(false);
      };
      
      fetchResults();
    }
  }, [query]);
  
  return (
    <Layout>
      <Head>
        <title>Search Results | ATP Medical Education</title>
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {results.length > 0 
            ? `Search Results for "${query}"`
            : `No results found for "${query}"`
          }
        </h1>
        
        <p className="text-gray-600 mb-8">
          {results.length} videos found
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : results.length > 0 ? (
          <VideoGrid videos={results} />
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-700 mb-4">Try a different search term or browse categories.</p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Browse All Videos
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.q as string || '';
  
  if (!query.trim()) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  const searchQuery = `*[_type == "video" && (title match $searchTerm || description match $searchTerm)] {
    _id,
    title,
    "slug": slug.current,
    youtubeId,
    description
  }`;
  
  const results = await client.fetch(searchQuery, { 
    searchTerm: `*${query}*` 
  });
  
  return {
    props: {
      initialResults: results,
      query,
    },
  };
};