// src/components/video/VideoGrid.tsx
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

interface Video {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string;
  description?: string;
  featuredImage?: any;
}

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  // Get the YouTube thumbnail URL as a fallback
  const youtubeThumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  
  // First try to use the Sanity featuredImage with proper error handling
  let thumbnailUrl = youtubeThumbUrl;
  
  try {
    if (video.featuredImage) {
      thumbnailUrl = urlFor(video.featuredImage).width(800).url();
    }
  } catch (error) {
    console.error("Error generating Sanity image URL:", error);
    // Fallback to YouTube thumbnail if there's an error
  }
  
  return (
    <Link href={`/videos/${video.slug}`} className="group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        {/* The actual image */}
        <img 
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        
        {/* Play button overlay - with completely transparent background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Play button icon - only visible on hover */}
          <svg 
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-80
                      transition-opacity duration-200 drop-shadow-[0_0_3px_rgba(0,0,0,0.7)]" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </Link>
  );
}