// src/pages/videos/index.tsx
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import VideoGrid from '../../components/video/VideoGrid';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

interface VideosPageProps {
  videos: any[];
}

export default function VideosPage({ videos }: VideosPageProps) {
  return (
    <Layout>
      <Head>
        <title>All Videos | ATP Medical Education</title>
        <meta name="description" content="Browse all medical education videos" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Videos</h1>
        
        {videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <p className="text-gray-600">
            No videos available yet. Please check back soon!
          </p>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const videos = await client.fetch(`
    *[_type == "video"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      youtubeId,
      description,
      featuredImage
    }
  `);
  
  return {
    props: {
      videos: videos || [],
    },
    revalidate: 60, // ISR: revalidate every minute
  };
};