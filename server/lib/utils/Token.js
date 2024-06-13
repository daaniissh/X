import jwt from "jsonwebtoken"

export const generateTokenAndSetCookies = (userId,res)=>{
  const token = jwt.sign({userId},process.env.SECRET_JWT,{
    expiresIn:"15d"
  })
  res.cookie("jwt",token,{
    maxAge:15*24*60*60*100,
    httpOnly:true,
    sameSite:strict,
    secure:process.env.NODE_ENV !== "development"
  })
}