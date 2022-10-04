const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    
  },
  user: {
    type: String,
    required: true,
    
  },

  password: {
    type: String,
    required: true,
    
  },
  content: {
    type: String,
    required: true,
    
  },
  created : {                  
    type : Date,
    default : Date.now
  } 
                              
},{
  versionKey :false
});

module.exports = mongoose.model("post", postSchema);