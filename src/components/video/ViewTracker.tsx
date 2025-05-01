// src/components/video/ViewTracker.tsx
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface ViewTrackerProps {
  videoId: string;
}

export default function ViewTracker({ videoId }: ViewTrackerProps) {
  const { data: session } = useSession();
  const hasTrackedView = useRef(false);
  
  useEffect(() => {
    // Only track view if user is logged in and we haven't tracked it yet in this session
    if (session?.user?.id && !hasTrackedView.current) {
      const trackView = async () => {
        try {
          await fetch('/api/account/track-view', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoId,
              // For now, we're just tracking that the video was viewed
              // In a more advanced implementation, we could track progress and completion
              progress: 0,
              completed: false,
            }),
          });
          
          // Mark as tracked so we don't track multiple times
          hasTrackedView.current = true;
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      };
      
      trackView();
    }
  }, [session, videoId]);
  
  // This is a "headless" component that doesn't render anything visually
  return null;
}