// src/pages/index.tsx
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import VideoGrid from '@/components/video/VideoGrid';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

interface HomeProps {
  featuredVideos: any[];
}

export default function Home({ featuredVideos }: HomeProps) {
  return (
    <Layout>
      <Head>
        <title>ATP Medical Education</title>
        <meta name="description" content="Medical education videos and resources" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Featured Medical Education Videos</h1>
        
        {featuredVideos.length > 0 ? (
          <VideoGrid videos={featuredVideos} />
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
  const featuredVideos = await client.fetch(`
    *[_type == "video" && isFeatured == true] | order(publishedAt desc) {
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
      featuredVideos: featuredVideos || [],
    },
    revalidate: 60, // ISR: revalidate every minute
  };
};