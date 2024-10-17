/* import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );
  export default mongoose.model('word', WordSchema) */;


import mongoose from 'mongoose';
const WordSchema = new mongoose.Schema({
  mistakesCount: {
    type: Number,
    required: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
     unique: true,
  },
  translate:{
    type: String,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
}, {
  timestamps: true,
});
export default mongoose.model('Word', WordSchema); 

