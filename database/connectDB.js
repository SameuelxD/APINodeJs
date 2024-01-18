import mongoose from "mongoose";

try {
    await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jm2rmy9.mongodb.net/${process.env.DATABASE}`);
    console.log('Connect Succesfull');
}
catch (error) {
    console.log('Connect Failed: '+error);
}