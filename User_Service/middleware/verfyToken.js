const jwt = require('jsonwebtoken')
const User = require('../models/User')

//every private route we check token is available
module.exports = async function (req,res,next){
      const token  = req.header('authtoken')
     // Check if the auth-token cookie is present///////////////////////////////////////////////////////
    // const token = req.cookies['authtoken'];
     if(!token) return res.status(401).json({error : 'Access denied, login again'})
 
     try{
         const verified = jwt.verify(token, process.env.TOKEN_SECRET)
         req.user =  await User.findById(verified._id)
         next()
     }catch(err){
         res.status(400).json({error : 'Invalid tokennnnn'})
     }
 }