exports.secretValues = [
  'password'
];
exports.removeSecrets = user => {
  for (var i = 0; i < exports.secretValues.length; i++) {
    delete user[exports.secretValues[i]];
  }
  console.log(user);
};
exports.Error = class UserError {
  constructor(msg) {
    this.message = msg;
  }
};
