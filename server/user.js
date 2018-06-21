exports.secretValues = [
  'password'
];
exports.removeSecrets = user => {
  for (var i = 0; i < exports.secretValues.length; i++) {
    delete user[exports.secretValues[i]];
  }
};
exports.Error = class UserError {
  constructor(msg) {
    this.message = msg;
  }
};
