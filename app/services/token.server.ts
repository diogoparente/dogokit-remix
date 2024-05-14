import jwt from "jsonwebtoken"

const generateToken = ({ email, expiresIn = "1h" }: { email: string; expiresIn?: string }) =>
  jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn })

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    console.error("Token verification failed:", error)
    throw new Error("Token is invalid")
  }
}

export { generateToken, verifyToken }
