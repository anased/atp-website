// src/components/video/VideoPlayer.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ViewTracker from './ViewTracker';
import BookmarkButton from './BookmarkButton';

interface VideoPlayerProps {
  videoId: string; 
  youtubeId: string;
  containerClassName?: string;
  showBookmark?: boolean;
}

export default function VideoPlayer({ 
  videoId, 
  youtubeId, 
  containerClassName = '',
  showBookmark = true 
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data: session } = useSession();
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Check if the video is bookmarked when component mounts
    if (session?.user?.id) {
      const checkBookmarkStatus = async () => {
        try {
          const response = await fetch(`/api/account/check-bookmark?videoId=${videoId}`);
          
          if (response.ok) {
            const data = await response.json();
            setIsBookmarked(data.isBookmarked);
          }
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      };
      
      checkBookmarkStatus();
    }
  }, [session, videoId]);
  
  if (!isLoaded) {
    return <div className={`w-full pt-[56.25%] bg-gray-200 animate-pulse ${containerClassName}`}></div>;
  }
  
  return (
    <>
      {/* Track view when the video is loaded */}
      <ViewTracker videoId={videoId} />
      
      <div className="space-y-4">
        {/* Video player */}
        <div className={`relative w-full mx-auto overflow-hidden ${containerClassName}`} style={{ paddingBottom: '56.25%', maxWidth: '640px' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Bookmark button */}
        {showBookmark && session && (
          <div className="flex justify-end">
            <BookmarkButton 
              videoId={videoId} 
              initialIsBookmarked={isBookmarked} 
            />
          </div>
        )}
      </div>
    </>
  );
}