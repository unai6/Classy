
const mongoose = require('mongoose')
const moment= require('moment')
moment().format( );
const Schema = mongoose.Schema;


const classSchema = new Schema ({

classDate : Date,
name: String, 
description: String,
time:String,
//level : {type: String,  enum: [ 'Basic', 'Intermediate', 'Advanced'] },  
user: [{ type: Schema.Types.ObjectId, ref:'User'}],
teacher: { type: Schema.Types.ObjectId, ref:'User'}

},
{
timestamps: true
})

Class = mongoose.model('Class', classSchema);

module.exports = Class;
