import mongoos from 'mongoose'

const connectDb = async() => {

    const mongoUri = process.env.MONGODB_URI;
    
    
    try{
        await mongoos.connect(`${mongoUri}/newData`);
        
    }catch(error){
        console.log('Mongo Connection Db Error'+error)
    }
}

export default connectDb;

 