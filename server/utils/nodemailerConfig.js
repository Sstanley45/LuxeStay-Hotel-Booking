// module.exports = {
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "christine.johnson74@ethereal.email",
//     pass: "9dXnUz9kEVg1bqe3XN",
//   },
// };

module.exports = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};
