const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({


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

});


module.exports = mongoose.model("comment", commentSchema);