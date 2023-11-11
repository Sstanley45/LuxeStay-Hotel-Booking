const notFound = (req, res) => res.status(400).send('Route Does Not Exist!');

module.exports = notFound