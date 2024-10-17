
import mongoose from 'mongoose';
const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
       unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});
export default mongoose.model('Group', GroupSchema); 