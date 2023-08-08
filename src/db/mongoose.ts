import validator  from "validator"
import mongoose from "mongoose"

if (!process.env.MONGOOSECONATLAS) {
    throw new Error("MOONGOSEATLAS ne pas sur env");
}

const connection : string | undefined = process.env.MONGOOSECONATLAS

const dbName = 'threats-app'

mongoose.connect(connection, {

})