import validator  from "validator"
import mongoose from "mongoose"

if (!process.env.MOONGOSEATLAS) {
    throw new Error("MOONGOSEATLAS ne pas sur env");
}

const connection : string | undefined = process.env.MOONGOSEATLAS

const dbName = 'threats-app'

mongoose.connect(connection, {

})