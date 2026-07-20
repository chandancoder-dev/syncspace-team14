import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "secretKey";


const login = async (req,res) =>{

    const {email , password} = req.body;

    try{

        const user = await User.findOne({email : email});

        if(!user){
            return res.status(404).json({message : "user not found"});
        }
        
        const isMatch = await bycrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({message : "Wrong password"});
        }

        
        const token = jwt.sign({userid : user.id}, secretKey, {expiresIn : "24h"});

        return res.status(200).json({token : token , message : "login sucessfull"});

    }
    catch(e){
        console.log(e);

        return res.status(500).json({message : "Fialed to login"});
    }
    
}

export default login;
