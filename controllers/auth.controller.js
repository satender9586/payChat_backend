const userSchema = require("../models/auth.model.js");
const { ApiError } = require("../utils/apiError.js");
const { ApiResponse } = require("../utils/apiResponse.js");
const { hashPassword, comparePassword } = require("../helper/password.methods.js");
const { generateAccessAndRefreshToken, tokenVerify } = require("../helper/token.methods.js")
const { cookieOptions } = require("../constant/cookie.constant.js")


//-------------> USER CONTROLLER
const register = async (req, res) => {
  const { firstName, email, password } = req.body;
  try {
    // validate field should not missing
    if (!firstName || !email || !password) {
      const error = new ApiError(404, "fields are missing!..");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }
    // validate is user already exist
    const isUserExist = await userSchema.findOne({ email });

    if (isUserExist) {
      const error = new ApiError(401, "User alredy exists!..");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    // hash password
    const hashPass = await hashPassword(password);


    // save new user
    const newUser = new userSchema({
      firstName,
      email,
      password: hashPass,
    });
    await newUser.save();
    const newUserdata = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
    };
    const response = new ApiResponse(201, "User registered successfully!", newUserdata);
    return res.status(response.statusCode).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    const errors = new ApiError(500, "Something went wrong");
    return res.status(errors.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
};

//-------------> LOGIN CONTROLLER
const loggin = async (req, res) => {
  const { email, password } = req.body
  try {
    // validate field should not missing
    if (!email || !password) {
      const error = new ApiError(404, "fields are missing!..");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    // check user is exists
    const isUserExist = await userSchema.findOne({ email })
    if (!isUserExist) {
      const error = new ApiError(400, "unauthorized credencial!..");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }
    // validate password 
    const plainPassword = await comparePassword(password, isUserExist.password)
    if (!plainPassword) {
      const error = new ApiError(400, "wrong password!..");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    // token generate access and refresh
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(isUserExist)
    const userData = {
      email: isUserExist.email,
      accesstoken: accessToken,
      refreshToken
    }

    await userSchema.findOneAndUpdate(
      { email },
      { authToken: accessToken, refreshToken },
      { new: true }
    );




    const response = new ApiResponse(200, userData, "login successfully!");
    return res.status(response.statusCode)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        data: response.data,
        message: response.message,
      });


  } catch (error) {
    const errors = new ApiError(500, "Something went wrong");
    return res.status(errors.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
};


// ------------> FIND AUTH INFO 
const authInfo = async (req, res) => {
  const user = req.user;
  const userId = req.user._id
  try {
    // validate token is missing 
    if (!user && !userId) {
      const error = new ApiError(404, "token is missing!");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    // find user in database

    const isUserExist = await userSchema.findOne({ _id: userId })

    if (!isUserExist) {
      const error = new ApiError(404, "User does not exits!");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    //  destruct user object
    const { _id, firstName, email, profile, status, role, isVerified } = isUserExist
    const userData = { _id, firstName, email, profile, status, role, isVerified }

    const response = new ApiResponse(200, userData, "User infomation retrive succesfully!");
    console.log(response)
    return res.status(response.statusCode).json({
      success: true,
      data: response.data,
      message: response.message,
    });


  } catch (error) {
    console.error("Retrive user info error:", error);
    const errors = new ApiError(500, "Retrive user info error");
    return res.status(errors.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
}


// ------------> FIND USER 
const userInfo = async (req, res) => {
  const id = req.params.id; 
  const user = req.user;
  const userId = user?._id;

  try {
    if (!user || !userId) {
      const error = new ApiError(401, "Token is missing or invalid.");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    if (!id) {
      const error = new ApiError(400, "User ID is missing in URL.");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    const isUserExist = await userSchema.findById(id);

    if (!isUserExist) {
      const error = new ApiError(404, "User does not exist.");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    const { _id, firstName, email, profile, status, role, isVerified } = isUserExist;
    const userData = { _id, firstName, email, profile, status, role, isVerified };

    const response = new ApiResponse(200, userData, "User information retrieved successfully!");
    return res.status(response.statusCode).json({
      success: true,
      data: response.data,
      message: response.message,
    });

  } catch (error) {
    console.error("Something is wrong in userInfo api!:", error);
    const errors = new ApiError(500, "Something is wrong in userInfo api!.");
    return res.status(errors.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
};

//-------------> LOGGED OUT CONTROLLER

const loggedOut = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) {
      const error = new ApiError(404, "User not authenticated");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    const response = new ApiResponse(200, null, "Logged out successfully");
    return res.status(response.statusCode).json({ success: true, data: response.data, message: response.message, });

  } catch (error) {
    const errors = new ApiError(500, "Something went wrong");
    return res.status(errors.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
};

// -------------> REFRESH TOKEN CONTROLLER
const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      const error = new ApiError(401, "Unauthorized access or refresh token missing!");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }


    const decodedToken = await tokenVerify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
    const userId = decodedToken?._id

    const { refreshToken } = await userSchema.findOne({ _id: userId })

    if (incomingRefreshToken !== refreshToken) {
      const error = new ApiError(404, "Refresh token expired or used!");
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(decodedToken);

    const userData = {
      email: decodedToken.email,
      accesstoken: accessToken,
      newRefreshToken
    }

    const response = new ApiResponse(200, userData, "New refresh token generated successfully!");
    return res.status(response.statusCode)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        data: response.data,
        message: response.message,
      });

  } catch (error) {
    console.error("Refresh Token error:", error);
    const errors = new ApiError(500, "An error occurred during token refresh");
    return res.status(error.statusCode).json({
      success: false,
      message: errors.message,
      errors: errors.errors,
      data: errors.data,
    });
  }
};


module.exports = { register, loggin, authInfo, userInfo, loggedOut, refreshAccessToken };
