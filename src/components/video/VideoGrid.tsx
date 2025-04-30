import Link from 'next/link';
import Image from 'next/image';

interface Video {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string;
  description?: string;
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
  // Create a video thumbnail URL from YouTube video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
  
  return (
    <Link href={`/videos/${video.slug}`} className="group block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        <Image 
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-200" 
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