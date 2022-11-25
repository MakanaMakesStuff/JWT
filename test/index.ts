import JWTModule from "../jwt/"
const jwt = new JWTModule()

const payload: JWTModule.Payload = {
  username: "root",
  password: "abc123",
}

const token = jwt.generate({ payload }) // Returns new JWT token
const decode = jwt.decode(token) // Returns decoded payload
const valid = jwt.verify(token) // Returns true or false if token signature is valid

console.table({
  token,
  decode,
  valid,
})
