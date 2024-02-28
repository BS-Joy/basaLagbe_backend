import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(('MongoDB Connected', conn.connection.host))
    } catch (err) {
        console.error(`Error : ${err.message}`);
        // forcefully terminate the node.js process when any error occured during mongodb connection
        process.exit(1)
    }
}

export default connectDb