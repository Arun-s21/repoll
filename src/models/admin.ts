import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trime:true
    },

    password: {
        type:String,
        required:true
    },


});

const AdminModel = mongoose.models.Admin || mongoose.model('Admin',AdminSchema);
export default AdminModel;