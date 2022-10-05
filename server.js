const express =  require('express');
const app =  express();
const mongoose = require('mongoose');

const User = require('./users');

mongoose.connect('mongodb://localhost/pagination')

const db = mongoose.connection

db.once('open', async()=>{
    if(await User.countDocuments().exec() > 0) return;

    Promise.all([
        User.create({name: 'User 1'}),
        User.create({name: 'User 2'}),
        User.create({name: 'User 3'}),
        User.create({name: 'User 4'}),
        User.create({name: 'User 5'}),
        User.create({name: 'User 6'}),
        User.create({name: 'User 7'}),
        User.create({name: 'User 8'}),
        User.create({name: 'User 19'}),
        User.create({name: 'User 10'}),
        User.create({name: 'User 11'}),
        User.create({name: 'User 12'}),
        User.create({name: 'User 13'}),
        User.create({name: 'User 14'}),
        User.create({name: 'User 15'})

    ]).then(()=>console.log("added users"))

})

app.get('/users',paginatedResults(User),(req,res)=>{
    res.json(res.paginatedResults)
})



function paginatedResults(model){
    return async(req, res,next) =>{
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const results = {};
    
        if(endIndex < await model.countDocuments().exec()){
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
       
    
        if(startIndex > 0){
            results.previous = {
                page: page  - 1,
                limit: limit
            }
        }
       
        try{
            results.resultUsers = await model.find().limit(limit).skip(startIndex).exec()
        }catch(e){
            res.status(500).json({message: e.message})
        }
    
       // results.resultUsers = model.slice(startIndex,endIndex);
      
        res.paginatedResults = results;
        next()
    }
}

app.listen(5435);
