// src/utils/imageUtils.ts - Create this file

import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Initialize the image URL builder with your project details
const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

/**
 * Helper function to safely generate Sanity image URLs
 * @param source Sanity image reference
 * @returns Image URL builder instance or null if source is invalid
 */
export function getSanityImageUrl(source: SanityImageSource | null | undefined) {
  if (!source) {
    return null;
  }

  // Check if source is valid (has either an _ref or an asset._ref)
  const hasRef = 
    (source as any)?._ref || 
    (source as any)?.asset?._ref || 
    (source as any)?.asset?.ref;

  if (!hasRef) {
    console.warn('Invalid Sanity image source:', source);
    return null;
  }

  try {
    return imageBuilder.image(source);
  } catch (error) {
    console.error('Error creating Sanity image URL:', error);
    return null;
  }
}

/**
 * Safely gets an optimized image URL from a Sanity image reference
 * @param source Sanity image reference
 * @param width Desired image width
 * @param fallbackUrl Fallback URL if Sanity image can't be processed
 * @returns String URL or fallback URL
 */
export function getSafeImageUrl(
  source: SanityImageSource | null | undefined, 
  width = 800,
  fallbackUrl?: string
): string {
  try {
    const imageUrl = getSanityImageUrl(source);
    if (imageUrl) {
      return imageUrl.width(width).auto('format').url();
    }
  } catch (error) {
    console.error('Failed to generate image URL:', error);
  }
  
  return fallbackUrl || '/placeholder-image.jpg'; // Provide a default placeholder
}

export default getSafeImageUrl;