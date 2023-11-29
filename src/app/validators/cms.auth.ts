export const loginSchema: AjvSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: {
      type: ['string', 'null'],
      pattern: '^(\\S+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$'
    },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const requestAccessTokenSchema: AjvSchema = {
  type: 'object',
  required: ['refreshToken'],
  additionalProperties: false,
  properties: {
    refreshToken: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const changePasswordSchema: AjvSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    newPassword: {
      type: 'string',
      minLength: 6,
      maxLength: 255,
      pattern: '^[a-zA-Z0-9]+$'
    },
  },
};

export const updateSchema: AjvSchema = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    fullName: {
      type: 'string',
      minLength: 10,
      maxLength: 255,
    },
    phoneNumber: {
      type: 'string',
      pattern: '^([0-9\\+\\s-]{8,13})$',
    },
    birthday: {
      format: 'date',
    },
    email: {
      type: 'string',
      pattern: '^(\\S+([\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)$'
    },
  },
};
