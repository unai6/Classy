const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*const pictureSchema = new Schema(
  {
    name: String,
    path: String,
    originalName: String
  },
  {
    timestamps: true
  }
);

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture

const mongoose = require('mongoose');
const Schema = mongoose.Schema;*/

const pictureSchema = new Schema(
  {
    title: String,
    description: String,
    imgName: String,
    imgPath: String
  },
  {
    timestamps: true
  }
);

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;