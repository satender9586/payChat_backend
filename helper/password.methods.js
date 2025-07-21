const bcrypt = require("bcrypt") 
const {saltValue} = require("../constant/password.constant.js")

// password Hash
 async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, saltValue);
  return hash;
}

// password enbcrypt 
async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch; 
}



module.exports = {hashPassword,comparePassword}