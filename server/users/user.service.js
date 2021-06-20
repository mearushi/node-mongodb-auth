const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
  authenticate,
  getById,
  create
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: 60 * 3 });
    return {
      token
    };
  }
}

async function getById(id) {
  return await User.findById(id);
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.email })) {
    throw 'Email "' + userParam.email + '" is already taken';
  }
  // validate date
  let dob = userParam.dateOfBirth;
  var pattern = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/;
  if (!pattern.test(dob)) {
    throw 'Date of Birth "' + userParam.dateOfBirth + '" should be in format yyyy/mm/dd';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}
