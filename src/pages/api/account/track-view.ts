// src/pages/api/account/track-view.ts
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
    const { videoId, progress, completed } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    // First check if viewing history entry already exists
    const existingHistory = await prisma.$queryRaw`
      SELECT * FROM "ViewingHistory" 
      WHERE "userId" = ${session.user.id} AND "videoId" = ${videoId}
    `;
    
    const completedValue = completed === true;
    const progressValue = progress || null;
    
    if (!Array.isArray(existingHistory) || existingHistory.length === 0) {
      // Create new viewing history record
      await prisma.$executeRaw`
        INSERT INTO "ViewingHistory" (
          "id", "userId", "videoId", "watchedAt", "progress", "completed"
        )
        VALUES (
          gen_random_uuid(), 
          ${session.user.id}, 
          ${videoId}, 
          NOW(), 
          ${progressValue}, 
          ${completedValue}
        )
      `;
    } else {
      // Update existing viewing history record
      await prisma.$executeRaw`
        UPDATE "ViewingHistory"
        SET 
          "watchedAt" = NOW(),
          "progress" = COALESCE(${progressValue}, "progress"),
          "completed" = ${completedValue}
        WHERE 
          "userId" = ${session.user.id} AND 
          "videoId" = ${videoId}
      `;
    }

    return res.status(200).json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error('Error tracking view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}