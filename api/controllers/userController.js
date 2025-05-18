import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";

// function to create token
const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for userLogin
const loginUser = async (req, res) => {
    try {
        // get user's email and password from body
        const { email, password } = req.body;

        // checking existance of user email
        const user = await userModel.findOne({email});

        if(!email) {
            return res.json({ success: false, message: "User does not exist" });
        } 

        // check entered password is correct or not
        const isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) {
            const token  = createtoken(user._id);
            res.json({success:true, token})
        } else {
          return res.json({success:false, message:"Invalid credentials"})
        }

    } catch (error) {
      console.log(error);
      res.json({success:false, message: error.message})
    }
};

// Route for register user
const registerUser = async (req, res) => {
  try {
    // getting name, email, and password from the body
    const { name, email, password } = req.body;

    // checking user already exist
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exist" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter Strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // store name email and hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // generate token using function createToken
    const token = createtoken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password, process.env.JWT_SECRET);
      res.json({success:true, token})
    } else{
      res.json({success:false, message:"Invalid Credentials"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
  }
};
export { loginUser, registerUser, adminLogin };
