const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const accessToken = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) || null;
            console.log(accessToken)
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token missing."
            });
        }


        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (errors) {
        console.error("Token verification failed:", errors);
        const error = new ApiError(401, "Invalid or expired token.");
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
            data: error.data,
        });
    }
};

module.exports = verifyToken;

