const fs=require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour=require('./../../models/tourModel')
const User=require('./../../models/userModel')
const Review=require('./../../models/reviewModel')


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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



const importData=async()=>{
    try{
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(reviews)

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
        await User.deleteMany()
        await Review.deleteMany()

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


