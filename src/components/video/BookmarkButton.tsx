// src/components/video/BookmarkButton.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface BookmarkButtonProps {
  videoId: string;
  initialIsBookmarked?: boolean;
}

export default function BookmarkButton({ videoId, initialIsBookmarked = false }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sync with prop if it changes
  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);
  
  const handleToggleBookmark = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/toggle-bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          action: isBookmarked ? 'remove' : 'add',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }
      
      // Toggle bookmark state
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Show error toast/notification here if needed
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`flex items-center focus:outline-none ${isLoading ? 'opacity-50' : ''}`}
    >
      {isBookmarked ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      <span className="ml-2">
        {isBookmarked ? 'Saved' : 'Save'}
      </span>
    </button>
  );
}