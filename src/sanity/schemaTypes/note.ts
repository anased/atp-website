// src/sanity/schemaTypes/note.ts
export default {
    name: 'note',
    title: 'Note',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'content',
        title: 'Content',
        type: 'array', // Change from markdown to portable text
        of: [
          {
            type: 'block',
            // Styles for text formatting - these are the default options
            styles: [
              {title: 'Normal', value: 'normal'},
              {title: 'H1', value: 'h1'},
              {title: 'H2', value: 'h2'},
              {title: 'H3', value: 'h3'},
              {title: 'H4', value: 'h4'},
              {title: 'Quote', value: 'blockquote'}
            ],
            // Add lists option
            lists: [
              {title: 'Bullet', value: 'bullet'},
              {title: 'Number', value: 'number'}
            ],
            // Define marks for inline formatting
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
                {title: 'Code', value: 'code'},
                {title: 'Underline', value: 'underline'},
                {title: 'Strike', value: 'strike-through'}
              ],
              // Add link mark
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'Link',
                  fields: [
                    {
                      name: 'href',
                      type: 'url',
                      title: 'URL'
                    }
                  ]
                }
              ]
            }
          },
          // Add support for images
          {
            type: 'image',
            options: {
              hotspot: true
            },
            fields: [
              {
                name: 'caption',
                type: 'string',
                title: 'Caption',
                options: {
                  isHighlighted: true
                }
              },
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative text',
                description: 'Important for accessibility and SEO',
                options: {
                  isHighlighted: true
                }
              }
            ]
          },
          // Add other types if needed (tables, code blocks, etc.)
        ]
      }
    ]
  }