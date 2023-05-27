
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { UsersModel } from '~/server/models/Users.model'
import { comparePassword } from '~/server/utils/encype'

export default NuxtAuthHandler({
  // secret needed to run nuxt-auth in production mode (used to encrypt data)
  // secret: process.env.NUXT_SECRET,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    // signIn: '/login'
  },
  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point

    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.

      authorize: async (credentials: any) => {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        const user = await UsersModel.findOne({ where: { email: credentials.email } })

        if (user === null) {
          return null
        } else {
          const checkPassword = await comparePassword(credentials.password, user.dataValues.password)
          if (!checkPassword) {
            return null
          }
          return user.dataValues
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt ({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          ...user
        }
      }

      return token
    },
    session ({ session, token }) {
      session.user = {
        ...session.user,
        ...token
      }

      return session
    }
  }
})
