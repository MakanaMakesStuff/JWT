## Json Web Tokens
### Importance
- allows for authentication by checking against a secret key on the server instead of using expensive database queries and other network operations.

### Security
The way you store a JWT will mean different things for your web apps security. There are three main risk correlated to the storage of a JWT and they are as follows:

- Man in the Middle Attacks --- we have to ensure that our app only works over https to prevent possible sniffing of our token over public wifi networks.

- Cross-Site Scripting(JS injection/XSS) Attacks --- Because the local storage/session is accessible through JS API, it makes it vulnerable to rouge JS code in our browser. If this occurs, our session data will be compromised. Because of this it is suggested to utilize cookies to store our tokens.

- Cross-Site Request Forgery (CSRF) Attacks --- Although XSS and Man in the middle attacks can be prevented by strictly using https-only flags in our cookies, this does not prevent CSRF Attacks which can be done by sending request to our site from an unknown source or domain. A solution for this would be to specify Same-Site cookie attribute to strict, but doing this may impact the functionality of your application. So discretion is advised.

- it is important to note that when a token is created, we cannot magically or remotely change the expiration of these tokens, so to revoke privileges for a given token, we would have to make each token short lived and revalidate the token on each request or generate a new one if it is expired and the user still has permission to access the application. This seems to be the most ideal way of handling the revocation of user privileges.

### Structure
`header.payload.signature`

- Header --- Will determine how our JWT signature will be generated
- Payload(Claims) --- Contains the information about the user. This is trivially encoded and should NOT contain sensitive information, just what we need to validate a user and other options related to the token. i.e expiration date.
- Signature is base64 encoded string of our header and payload(Utilizes a secret key when generate on our server).

### Example
```typescript
import JWTModule from "../jwt/"
const jwt = new JWTModule()

const payload: JWTModule.Payload = {
  username: "root",
  email: "root@google.com",
}

const token = jwt.generate({ payload }) // Returns new JWT token
const decode = jwt.decode(token) // Returns decoded payload
const valid = jwt.verify(token) // Returns true or false if token signature is valid

console.table({
  token,
  decode,
  valid,
})

```
