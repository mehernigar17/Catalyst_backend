import mongoose from 'mongoose'
const participantSchema=new mongoose.Schema({

    

fullname:{type:String,required:true},
phoneNumber:{type:String,
    required:true
},
email:{type:String,required:true},
education:String,
password:{type:String,required:true},
interests:[String],
bookmarks:[{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],


},{timestamps:true})



export default  mongoose.model('participant',participantSchema)