const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const JobsSchema = new Schema(
{
  title: {
      type:String,
      },  
  company: {
      type:String
  },  
  location: {
      type:String
  },  
  phone:{
      type:String,
  },
  website: {
      type:String
  },
  requirements: {
      type:String
  },  
  salary: {
    type:Number
  },
  vacancy: {
    type:Number
  },
  category: {
    type: [String],
    required: true,
  },
  posted_date: {
      type:Date
  },  
  closing_date: {
      type:Date
  }, 
  description: {
      type:String
  },  
  created_by: {
      type: ObjectId,
      ref: "User",
      required: true,
  },
  images: {
      type: String,
  }
}

);

module.exports = mongoose.model("Jobs", JobsSchema)