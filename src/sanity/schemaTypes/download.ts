export default {
    name: 'download',
    title: 'Download',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'file',
        title: 'File',
        type: 'file',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'fileType',
        title: 'File Type',
        type: 'string',
        options: {
          list: [
            {title: 'Anki Deck', value: 'anki'},
            {title: 'PDF', value: 'pdf'},
            {title: 'Other', value: 'other'}
          ]
        },
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        name: 'isPremium',
        title: 'Premium Content',
        type: 'boolean',
        initialValue: false
      }
    ]
  }