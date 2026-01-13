import mongoose from 'mongoose'

export default async function ConnectionDB(url){

    return mongoose.connect(url)

} 