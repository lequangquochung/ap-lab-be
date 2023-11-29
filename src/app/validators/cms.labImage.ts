export const labImageSchema: AjvSchema = {
    type: 'object',
    required: ['image'],
    additionalProperties: false,
    properties: {
        image: {
            type: 'string',
        },
        order: {
            type: 'integer',
        },
    },
  };