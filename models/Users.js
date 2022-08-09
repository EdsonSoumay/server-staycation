const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // mengencript password user

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
})

usersSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
      //jika isinya password, maka ubah passwordnya
    user.password = await bcrypt.hash(user.password, 8);
  }
})

module.exports = mongoose.model('Users', usersSchema)