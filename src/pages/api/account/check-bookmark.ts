// src/pages/api/account/check-bookmark.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { videoId } = req.query;

    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    // Check if the video is bookmarked using raw SQL
    const bookmarks = await prisma.$queryRaw`
      SELECT * FROM "Bookmark" 
      WHERE "userId" = ${session.user.id} AND "videoId" = ${videoId}
    `;

    // If bookmarks is an array with items, then the video is bookmarked
    const isBookmarked = Array.isArray(bookmarks) && bookmarks.length > 0;

    return res.status(200).json({ isBookmarked });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}