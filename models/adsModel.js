import mongoose from 'mongoose';

const adsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    rent: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    bedroom: {
        type: Number,
        required: true
    },
    bathroom: {
        type: Number,
        required: true
    },
    availableForm: {
        type: String,
        required: true
    },
    contact: {
        type: Object,
        required: true
    },
},
{
    timestamps: true
}
);

const Ads = mongoose.model('ads', adsSchema);

export default Ads;