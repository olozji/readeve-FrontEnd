import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,

      
    }),
  ],
  callbacks: {
    async signIn(user:any) {
      // 로그인 시 실행되는 코드 작성
      // 사용자 정보, 계정 정보, 프로필 정보 등을 활용할 수 있음
      console.log("User signed in:", user);
      return true; // 로그인 성공 여부를 반환 (true 또는 false)
    },
    // async redirect(url, baseUrl) {
    //   // 로그인 후 리다이렉션 시 실행되는 코드 작성
    //   console.log("Redirecting to:", url);
    //   return url; // 리다이렉션할 URL 반환
    // },
    // async session(session, user) {
    //   // 세션에 사용자 정보를 추가하는 코드 작성
    //   session.user = user;
    //   return session;
    // },
  },

  secret : process.env.NEXTAUTH_SECRET
}
 
export default NextAuth(authOptions);