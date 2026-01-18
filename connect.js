import mongoose from 'mongoose'

export default async function ConnectionDB(url){

    return mongoose.connect(url)

} //alltho i can use her try catch for better code 