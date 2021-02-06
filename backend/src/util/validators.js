module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Empty username'
  }
  if (email.trim() === '') {
    errors.email = 'Empty email'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Not valid email'
    }
  }
  if (password === '') {
    errors.password = 'Empty password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords dont match'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Empty username'
  }
  if (password.trim() === '') {
    errors.password = 'Empty password'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
};
