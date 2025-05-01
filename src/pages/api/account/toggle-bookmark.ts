// src/pages/api/account/toggle-bookmark.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { videoId, action } = req.body;

    if (!videoId || !action || (action !== 'add' && action !== 'remove')) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    if (action === 'add') {
      // Add bookmark using raw SQL or direct prisma query approach
      // First check if bookmark already exists
      const existingBookmark = await prisma.$queryRaw`
        SELECT * FROM "Bookmark" 
        WHERE "userId" = ${session.user.id} AND "videoId" = ${videoId}
      `;
      
      if (!Array.isArray(existingBookmark) || existingBookmark.length === 0) {
        // Create bookmark if it doesn't exist
        await prisma.$executeRaw`
          INSERT INTO "Bookmark" ("id", "userId", "videoId", "createdAt")
          VALUES (gen_random_uuid(), ${session.user.id}, ${videoId}, NOW())
        `;
      }

      return res.status(200).json({ message: 'Bookmark added successfully' });
    } else {
      // Remove bookmark
      await prisma.$executeRaw`
        DELETE FROM "Bookmark"
        WHERE "userId" = ${session.user.id} AND "videoId" = ${videoId}
      `;

      return res.status(200).json({ message: 'Bookmark removed successfully' });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}