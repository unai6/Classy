const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

  name: String,
  email: String,
  password: { type: String, require: true, unique: true },
  isTeacher: { type: Boolean, default: false },
  classPrice: { type: Number, default: null },
  bio: String,
  subject:String,
  phoneNumber:String,
  imgName: String,
  imgPath: {type: String, default :'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png' }
},

  {
    timestamps: true
  })

User = mongoose.model("User", userSchema);

module.exports = User;