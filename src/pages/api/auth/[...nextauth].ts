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
    // async redirect(url:any, baseUrl:any) {
    //   return Promise.resolve('http://www.bookeverywhere.site/api/oauth2/code/kakao');
    // },
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.user = {
          id: user.id, // 카카오톡 소셜 로그인으로 받아온 고유한 ID 값
          name: user.name,
          role: user.role,
          image: user.image
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user = token.user;
      return session;
    },
  },
  
  

  secret: process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)
