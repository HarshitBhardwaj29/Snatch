import User from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const  accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh token")
    }
}


const registerUser = asyncHandler( async (req,res) => {
    //check user exist or not
    //register user
    const {name,email,password} = req.body;
    if([name,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(404,"all fields are required")
    }

    const existeduser  = await User.findOne({email});
    if(existeduser){
        throw new ApiError("404","user already Existed");
    }

    const user = await User.create({
        name,
        email,
        password,
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


const loginUser = asyncHandler(async (req,res)=>{
    // data from req
    // find using email
    // check password   == bcrypt using compare
    // access token and refrsh token 
    // send cookies
    const {email,password} = req.body;

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(500,"Email not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        console.log("error is here")
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true,
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    }

    return res.status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(200,{},"user logout succesfully")
    )
})



export {
    registerUser,
    loginUser,
    logoutUser,
}

