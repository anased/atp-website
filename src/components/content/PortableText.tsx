// src/components/content/PortableText.tsx
import { PortableText as PortableTextComponent } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import Link from 'next/link';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableTextBlock, PortableTextReactComponents } from '@portabletext/react';

// Initialize the image URL builder
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

// Function to generate image URLs
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Define types for our Sanity content
interface SanityImageValue {
  _type: string;
  asset: {
    _ref: string;
  };
  alt?: string;
  caption?: string;
}

interface SanityLinkValue {
  _type: string;
  href: string;
}

// Define custom components for rendering
const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      
      return (
        <div className="relative w-full my-6 h-64 md:h-96">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ' '}
            className="rounded-lg"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ objectFit: 'contain' }}
          />
          {value.caption && (
            <div className="text-center text-sm text-gray-600 mt-2">
              {value.caption}
            </div>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      // Add null checks since value might be undefined
      const href = value?.href || '#';
      const rel = !href.startsWith('/') ? 'noreferrer noopener' : undefined;
      
      return (
        <Link 
          href={href} 
          rel={rel} 
          className="text-blue-600 hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
};

export default function PortableText({ content }: { content: PortableTextBlock[] }) {
  if (!content) {
    return null;
  }
  
  return (
    <div className="prose prose-blue max-w-none">
      <PortableTextComponent value={content} components={components} />
    </div>
  );
}