const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Schema = mongoose.Schema;

const FreelancerSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email_address: { type: String, required: true },
    phone_number: { type: String, required: true },
    description: { type: String, required: true },
    resume: [{ type: Array, ref: 'Resume', required: false }],
    password: { type: String, required: true },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// hashes the password when freelancer creates it
FreelancerSchema.pre("save", async function(next) {
    const freelancer = this;
    if (freelancer.isModified("password")) {
        freelancer.password = await bcrypt.hash(freelancer.password, 8);
    }
    next();
});

FreelancerSchema.methods.generateAuthToken = async function () {
    const freelancer = this;
    const token = jwt.sign({
        _id: freelancer._id,
        first_name: freelancer.first_name,
        email_address: freelancer.email_address,
        last_name: freelancer.last_name,
        phone_number: freelancer.phone_number
    }, "secret");
    freelancer.tokens = freelancer.tokens.concat({ token });
    await freelancer.save();
    return token;
};

FreelancerSchema.statics.findByCredentials = async (email_address, password) => {
    const freelancer = await freelancerModel.findOne({ email_address });
    if (!freelancer) {
        throw new Error({ error: "Invalid login details" });
    }
    const isPasswordMatch = await bcrypt.compare(password, freelancer.password);
    if (!isPasswordMatch) {
        throw new Error({ error: "Invalid login details" });
    }
    return freelancer;
}


const freelancerModel = new mongoose.model('Freelancer', FreelancerSchema);

module.exports = freelancerModel;