import * as bcrypt from 'bcrypt'

export const cryptPassword = async (password: string) => {
  const saltRounds = 10

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) { reject(err) }
      resolve(hash)
    })
  })

  return hashedPassword
}

export const comparePassword = async (password: string, hashword: string) => {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(password, hashword, function (err, isPasswordMatch) {
      if (err) { reject(err) }
      resolve(isPasswordMatch)
    })
  })
}
