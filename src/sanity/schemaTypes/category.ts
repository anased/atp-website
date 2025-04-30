// src/sanity/schemaTypes/category.ts
export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'order',
        title: 'Order',
        type: 'number',
        description: 'Used for sorting categories'
      }
    ]
  }