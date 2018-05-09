var Ajv = require('ajv');
var ajv = new Ajv();

exports.signup = (() => {
  var validate = ajv.compile({
    type: 'object',
    properties: {
      username: {
        type: 'string',
        pattern: '^[a-zA-Z\\d]{5,}$'
      },
      password: {
        type: 'string',
        pattern: '^[\\S]{5,}$'
      }
    },
    required: [
      'username',
      'password'
    ],
    additionalProperties: false
  });
  return (user) => {
    return validate(user);
  };
})();
