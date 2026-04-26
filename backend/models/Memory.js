import mongoose from 'mongoose';

const memorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    creator: {
        type: String,
        required: true,
        maxlength: 32
    },
    image: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;