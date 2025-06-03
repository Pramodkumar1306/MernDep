import mongoos from 'mongoose'

const connectDb = async() => {
    try{
        await mongoos.connect(`mongodb+srv://varun73patil:varunchutiya@cluster0.mk5dl7k.mongodb.net/newData`);
        console.log('Db Connected'); 
    }catch(error){
        console.log('Mongo Connection Db Error'+error)
    }
}

export default connectDb;

// mongodb+srv://123456krunal123456:123456Krunal123456@cluster0.qgmrttr.mongodb.net/?