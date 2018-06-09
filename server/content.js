exports.test = (test) => {
  return new Promise((resolve, reject) => {
    resolve(`This content was served on request to ${test}`);
  });
};
