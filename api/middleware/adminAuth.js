import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if(!token){
            return res.json({success:false, message:"Not Authorized Login Again"})
        }
        // verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // check if decoded token match with admin's email+password
        if(token_decode !== process.env.ADMIN_EMAIL  + process.env.ADMIN_PASSWORD){
            return res.json({success:false, message:"Not Authorised, Login Again"})
        }

        next();

        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

export default adminAuth;