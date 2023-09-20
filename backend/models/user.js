const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');



const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default : false,
  },
  verified: Date,
  
}, { timestamps: true });


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})


UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}



module.exports = mongoose.model('User', UserSchema); 