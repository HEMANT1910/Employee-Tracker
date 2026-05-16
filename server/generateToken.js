const jwt=require("jsonwebtoken")
require("dotenv").config()

const token=jwt.sign(

{

id:"12345",
email:"admin@gmail.com",
role:"admin"

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

)

console.log(
"\nGenerated Token:\n"
)

console.log(token)