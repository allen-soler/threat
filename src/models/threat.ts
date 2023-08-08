import mongoose from 'mongoose';


// description interface for each P
interface Entry {
    description: string
}

interface threatDocument extends Entry {
    name: string
    entries: Entry[]
    owner: mongoose.Schema.Types.ObjectId
    createdAt?: Date
    updateAt?: Date
}

const threatSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: Date.now,
        required: true
    },
    entries: [{
        description: {
            type: String,
            trime: true,
            required: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Threat = mongoose.model<threatDocument>('Threat', threatSchema)

export default Threat