import mongoos from 'mongoose'

const connectDb = async() => {

    const mongoUri = process.env.MONGODB_URI;
    // console.log(mongoUri);
    
    try{
        await mongoos.connect(`${mongoUri}/newData`);
        console.log('Db Connected'); 
    }catch(error){
        console.log('Mongo Connection Db Error'+error)
    }
}

export default connectDb;

// mongodb+srv://123456krunal123456:123456Krunal123456@cluster0.qgmrttr.mongodb.net/?