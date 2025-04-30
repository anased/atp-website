// src/components/content/PortableText.tsx
import { PortableText as PortableTextComponent } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import Link from 'next/link';

// Initialize the image URL builder
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

// Function to generate image URLs
function urlFor(source: any) {
  return builder.image(source);
}

// Define custom components for rendering
const components = {
  types: {
    image: ({ value }: any) => {
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
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <Link 
          href={value.href} 
          rel={rel} 
          className="text-blue-600 hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
};

export default function PortableText({ content }: { content: any }) {
  if (!content) {
    return null;
  }
  
  return (
    <div className="prose prose-blue max-w-none">
      <PortableTextComponent value={content} components={components} />
    </div>
  );
}