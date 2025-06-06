import mongoos from 'mongoose'

const connectDb = async() => {

    const mongoUri = process.env.MONGODB_URI;
    
    
    try{
        await mongoos.connect(`${mongoUri}/newData`);
        console.log(' MongoDB connected successfully')
    }catch(error){
        console.log('Mongo Connection Db Error'+error)
    }
}

export default connectDb;

