import NextAuth from 'next-auth/next'
import KakaoProvider from 'next-auth/providers/kakao'

export const authOptions: any = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, //30일
  },

  callbacks: {
    // async redirect(url: any, baseUrl: any) {
    //   return Promise.resolve(
    //     'https://api.bookeverywhere.site/oauth2/authorization/kakao',
    //   )
    // },
    async jwt({ token, user,trigger,session }:any) {
      if (trigger === 'update') {
              return {
                ...token,
                ...session.user,
              }
            }
      
            return { ...token, ...user };
          },
      
          async session({ session, token }:any) {
            session.user = token as any;
            return session;
          },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)
