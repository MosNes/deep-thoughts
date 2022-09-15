//capture environment variables
require('dotenv').config();

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const expiration = '2h';

module.exports = {
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        //creates JWT from payload, secret, and set expiration time
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }
};