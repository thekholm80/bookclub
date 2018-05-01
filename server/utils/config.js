require('dotenv').config();

const {
  PORT,
  JWT_SECRET,
  DB_URL
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_URL
};
