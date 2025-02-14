const fs=require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../models/tourModel')

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Add this to avoid deprecation warnings
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(()=>console.log('DB connection successful'))


const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

const importData=async()=>{
    try{
        await Tour.create(tours)
        console.log('data successfully loaded!')
        process.exit()

    }catch (err){
        console.log(err)
    }

}


//Delete All data from Db


const deleteData=async()=>{
    try{
        await Tour.deleteMany()
        console.log('data successfully deleted!')
        process.exit()

    }catch (err){
        console.log(err)
    }

}


if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData()
}
















//   .then(con => {
//     console.log(con.connections);
//     console.log('DB connection successful!');
//   })
//   .catch(err => {
//     console.error('DB connection error:', err);
//   });


