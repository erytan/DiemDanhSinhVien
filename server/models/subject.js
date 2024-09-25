const mongoose = require("mongoose"); // Erase if already required
const subjectSchema = new mongoose.Schema({
    id_subject: {
        type: String,
        required: true,
    },
    subjectname: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: ''
    },
    sessions: [{
        type: String,
        ref: 'Session'
    }],
    countSession: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Subject', subjectSchema);