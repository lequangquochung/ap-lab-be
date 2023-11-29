export const createTopicSchema: AjvSchema = {
    type: 'object',
    required: ['subContent', 'content', 'thumbnail', 'title'],
    additionalProperties: false,
    properties: {
      title: {
        type: 'string',
        maxLength: 255
      },
      thumbnail: {
        type: 'string',
      },
      subContent: {
        type: 'string',
        maxLength: 255
      },
      content: {
        type: 'string',
      },
    },
  };