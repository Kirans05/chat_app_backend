const jwt = require("jsonwebtoken")


const generateTocken = (id) => {
    let tocken = jwt.sign({id},process.env.SECERET_KEY,{expiresIn:"30d"})
    return tocken
}

module.exports = generateTocken