const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

  name: String,
  email: String,
  password: {type: String, require: true, unique: true},
  isTeacher: {type: Boolean, default: false},
  classPrice: {type: Number, default: null},
  photo: [{type:Schema.Types.ObjectId, ref:'Picture'}]
}, 

{
  timestamps: true
})

User = mongoose.model("User", userSchema);

module.exports = User;