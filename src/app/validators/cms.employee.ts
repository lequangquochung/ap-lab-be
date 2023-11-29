export const createEmployeeSchema: AjvSchema = {
    type: 'object',
    required: ['fullName', 'avatar', 'description', 'degree'],
    additionalProperties: false,
    properties: {
      fullName: {
        type: 'string',
        maxLength: 255
      },
      avatar: {
        type: 'string',
      },
      description: {
        type: 'string',
        maxLength: 1500
      },
      degree: {
        type: 'string',
        maxLength: 255
      },
    },
  };