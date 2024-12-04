const bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

exports.verifyPassword = async (plainPassword, hashedPassword) => {
    // console.log(plainPassword,hashedPassword);
  return bcrypt.compare(plainPassword, hashedPassword);
};
