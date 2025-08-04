import mongoose, { Schema } from 'mongoose';

// for a single option in a poll
const OptionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
});

//main structure for a Poll
const PollSchema = new Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  options: [OptionSchema], // array of the OptionSchema
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
 
});


const PollModel = mongoose.models.Poll || mongoose.model('Poll', PollSchema);

export default PollModel;