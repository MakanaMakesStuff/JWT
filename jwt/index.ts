import * as dotenv from "dotenv"
dotenv.config()

import * as crypto from "crypto"

class JWTModule {
  #secret: string

  constructor() {
    const { JWT_SECRET } = process.env

    if (!JWT_SECRET) throw new Error("Could not locate JWT_SECRET env var")

    this.#secret = JWT_SECRET
  }

  sign({
    header,
    payload,
  }: {
    header: JWTModule.Header
    payload: JWTModule.Payload
  }) {
    if (!this.#secret)
      throw new Error("Cannot generate signature without secret key")

    const h = Buffer.from(JSON.stringify(header)).toString("base64url")
    const p = Buffer.from(JSON.stringify(payload)).toString("base64url")

    const data = `${h}.${p}`

    const sig = crypto
      .createHmac("sha256", this.#secret)
      .update(data)
      .digest("base64url")

    return sig
  }

  decode(token: string) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  }

  verify(token: string) {
    const data = token.split(".").slice(0, 2).join(".")
    const sig = token.split(".")[2]
    const newSig = crypto
      .createHmac("sha256", this.#secret)
      .update(data)
      .digest("base64url")

    return newSig === sig
  }

  generate({
    header = {
      alg: "HS256",
      typ: "JWT",
    },
    payload,
  }: {
    header?: JWTModule.Header
    payload: JWTModule.Payload
  }) {
    const h = Buffer.from(JSON.stringify(header)).toString("base64url")
    const p = Buffer.from(JSON.stringify(payload)).toString("base64url")

    const signature = this.sign({
      header,
      payload,
    })

    const jwt = `${h}.${p}.${signature}`

    return jwt
  }
}

declare namespace JWTModule {
  export interface Payload {
    [key: symbol | string]: any
  }

  export interface Header {
    alg?: string
    typ?: string
    [key: symbol | string]: any
  }
}

export default JWTModule
