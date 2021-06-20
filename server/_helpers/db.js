const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
const mongodbUrl = process.env.MONGODBURL;
mongoose.connect(mongodbUrl, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model')
};
