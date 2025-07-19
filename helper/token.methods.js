const jwt = require("jsonwebtoken")


//-------------> ACCESS TOKEN GENERATE FUNCTION
const accessTokenGenerate = async (data) => {
    console.log("acces",process.env.ACCESS_TOKEN_SECRET_KEY)
  const token = await jwt.sign({ _id: data._id, email: data.email, role: data.role}, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY });
  return token;
};

//-------------> REFRESH TOKEN GENERATE FUNCTION

const refreshTokenGenerate = async (data) => {
  console.log("refrs",process.env.REFRESH_TOKEN_SECRET_KEY)
  const token = await jwt.sign({ _id:data._id,  email: data.email}, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY });
  return token;
};

//-------------> TOKEN Generate accesss and refresh
const generateAccessAndRefreshToken = async (userData)=>{
    const accessToken =await accessTokenGenerate (userData)
    const refreshToken = await refreshTokenGenerate(userData)
    return {accessToken,refreshToken}
}

//-------------> TOKEN VERIFY
const tokenVerify = async (token, key)=>{
  const tokenVerifyStatus = jwt.verify(token, key)
  return tokenVerifyStatus
}

module.exports = { accessTokenGenerate, refreshTokenGenerate,tokenVerify,generateAccessAndRefreshToken }