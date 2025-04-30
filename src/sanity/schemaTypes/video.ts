export default {
    name: 'video',
    title: 'Video',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'youtubeId',
        title: 'YouTube Video ID',
        type: 'string',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        name: 'featuredImage',
        title: 'Featured Image',
        type: 'image',
        options: {
          hotspot: true
        }
      },
      {
        name: 'isFeatured',
        title: 'Featured on Homepage',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime'
      },
      {
        name: 'case',
        title: 'Related Case',
        type: 'reference',
        to: [{type: 'case'}]
      },
      {
        name: 'note',
        title: 'Related Note',
        type: 'reference',
        to: [{type: 'note'}]
      },
      {
        name: 'downloads',
        title: 'Related Downloads',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'download'}]}]
      },
      {
        name: 'categories',
        title: 'Categories',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'category' }] }],
        description: 'Select categories for this video'
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
          layout: 'tags'
        },
        description: 'Add tags related to this video'
      }
    ]
  }