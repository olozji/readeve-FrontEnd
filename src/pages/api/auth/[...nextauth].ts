import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  secret : process.env.NEXTAUTH_SECRET
}
 
export default NextAuth(authOptions);