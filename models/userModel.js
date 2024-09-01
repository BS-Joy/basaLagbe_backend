import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    bookmarkedAds: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', userSchema);

export default User;