const subjectSchema = new mongoose.Schema({
    id_subject: {
        type: String,
        required : true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);