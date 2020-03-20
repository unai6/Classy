const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

  name: String,
  email: String,
  password: {type: String, require: true, unique: true},
  isTeacher: {type: Boolean, default: false},
  classPrice: {type: Number, default: null}
}, 
{
  timestamps: true
})

User = mongoose.model("User", userSchema);

module.exports = User;