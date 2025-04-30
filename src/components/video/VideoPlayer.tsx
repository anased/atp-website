import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  youtubeId: string;
  containerClassName?: string;
}

export default function VideoPlayer({ youtubeId, containerClassName = '' }: VideoPlayerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
      setIsLoaded(true);
    }, []);
    
    if (!isLoaded) {
      return <div className={`w-full pt-[56.25%] bg-gray-200 animate-pulse ${containerClassName}`}></div>;
    }
    
    return (
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
    );
  }