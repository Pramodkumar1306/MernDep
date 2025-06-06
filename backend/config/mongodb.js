import mongoos from 'mongoose'

const connectDb = async() => {
    
    try{
        await mongoos.connect(`mongodb+srv://varun73patil:varunchutiya@cluster0.mk5dl7k.mongodb.net/newData`);
        console.log(' MongoDB connected successfully')
    }catch(error){
        console.log('Mongo Connection Db Error'+error)
    }
}

export default connectDb;

