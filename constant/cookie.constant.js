const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
};

module.exports = {cookieOptions}
