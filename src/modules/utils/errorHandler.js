const registerValidationError = (error) => {
  let errors = {};
  const errorArray = error.details;
  errorArray.forEach((error) => {
    errors[error.path[0]] = error.message;
  });
  return errors;
};

module.exports = {
  registerError: registerValidationError,
};
