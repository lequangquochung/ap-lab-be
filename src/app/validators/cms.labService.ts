export const labServiceSchema: AjvSchema = {
    type: 'object',
    required: ['title'],
    additionalProperties: false,
    properties: {
        title: {
            type: 'string',
        },
        order: {
            type: 'integer',
        },
        details: {
            type: 'array'
        }
    },
  };