
class APIFeatures{
    constructor(query,querystring){
      this.query=query
      this.queryString=querystring
    }
  
    filter(){
      // 1️⃣ a) FILTERING
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // 1️⃣ b) ADVANCED FILTERING (MongoDB operators like $gte, $lte)
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log('Query Object:', JSON.parse(queryStr));
  
      this.query.find(JSON.parse(queryStr))
  
      return this;
    }
    sort(){
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' '); // Convert "sort=price,rating" → "price rating"
        this.query = this.query.sort(sortBy); // ✅ Correctly apply sorting
      } else {
        this.query = this.query.sort('-createdAt'); // ✅ Default sorting
      }
      return this;
    }
    limitFields(){
      if(this.queryString.fields){
        const field= this.queryString.fields.split(',').join(' ')
       this.query= this.query.select('name duration price')
      }else{
        this.query= this.query.select('-__v')
      }
  
      return this;
    }
    paginate(){
      const page = Number(this.queryString.page) || 1; // Ensure it's a number
      const limit = Number(this.queryString.limit) || 100; // Ensure a default value
      const skip = (page - 1) * limit;
   
   // 2️⃣ Apply Pagination
     this.query = this.query.skip(skip).limit(limit);
   
     
     return this
    }
  }
  

  module.exports=APIFeatures