export default {
    name: 'case',
    title: 'Case',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'description',
        title: 'Case Description',
        type: 'text',
        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
      },
      {
        name: 'questions',
        title: 'Questions',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'questionText',
                title: 'Question Text',
                type: 'text',
                validation: (Rule: import('@sanity/types').Rule) => Rule.required()
              },
              {
                name: 'options',
                title: 'Options',
                type: 'array',
                of: [
                  {
                    type: 'object',
                    fields: [
                      {
                        name: 'optionText',
                        title: 'Option Text',
                        type: 'string',
                        validation: (Rule: import('@sanity/types').Rule) => Rule.required()
                      },
                      {
                        name: 'isCorrect',
                        title: 'Is Correct Answer',
                        type: 'boolean',
                        initialValue: false
                      }
                    ],
                    preview: {
                      select: {
                        title: 'optionText',
                        subtitle: 'isCorrect'
                      },
                      prepare({title, subtitle}: {title: string; subtitle: boolean}) {
                        return {
                          title,
                          subtitle: subtitle ? '✓ Correct' : '✗ Incorrect'
                        }
                      }
                    }
                  }
                ],
                validation: (Rule: import('@sanity/types').Rule) => Rule.required().min(2)
              },
              {
                name: 'explanation',
                title: 'Answer Explanation',
                type: 'text'
              }
            ]
          }
        ]
      },
      {
        name: 'teachingPoints',
        title: 'Teaching Points',
        type: 'array',
        of: [{type: 'text'}]
      }
    ]
  }