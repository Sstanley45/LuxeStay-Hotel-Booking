const jwt = require('jsonwebtoken');


const oneDay = 1000 * 60 * 60 * 24;


const attachCookiesToResponse = ({ res, tokenUser }) => {
    //Create the Token using the tokenUser passed as an argument:
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });

    //Create the cookie
    res.cookie('token', token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed : true,
    })
    res.status(201).json({user:tokenUser})
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { attachCookiesToResponse, isTokenValid }
