import Image from 'next/image';
import mainTitle from '/public/images/mainTitle.png';
import mainLogo from '/public/images/mainLogo.png';


const Footer= () => {
    return (
      <footer 
      className="mx-auto text-center bottom-0 footer p-[3rem] bg-base-200 border border-slate-200">
        <div className="p-4">
          <p>
            <a
              href="/"
              className="link link-hover"
              target="_blank"
              rel="noreferrer noopener nofollow"
            >
              읽는곳곳
            </a>
          </p>
        </div>
      <div className="grid md:grid-flow-col gap-4">
        <div className='flex items-center gap-4'>
        <Image 
         src={mainLogo} 
         alt="메인 로고" 
         className="md:w-[7vw] sm:w-[8vw]"
         />
        <Image 
          src={mainTitle} 
          alt="메인 타이틀" 
          className="md:w-[4vw] md:h-[2vh] sm:w-[8vw] sm:h-[3vh]"
          />
      </div>
        <ul className="pt-5 grid grid-flow-col gap-4 md:absolute md:right-10">
          <li className="text-sm md:text-sm sm:text-xs">
          서비스기획 : 박혜인<br/>
          ㅇㅇㅇ@ㅇㅇㅇ.ㅇㅇㅇ
          </li>
          <li className="text-sm md:text-sm sm:text-xs">
          UI/UX 디자인 : 전예지<br/>
          jyeji99@naver.com
          </li>
          <li className="text-sm  md:text-sm sm:text-xs">
          프론트엔드개발 : 최성관, 최은지<br/>
          ㅇㅇㅇ@ㅇㅇㅇ.ㅇㅇ
          </li>
          <li className="text-sm  md:text-sm sm:text-xs">
          백엔드개발 : 권기대, 이성호<br/>
          ㅇㅇㅇ@ㅇㅇㅇ.ㅇㅇ
          </li>
        </ul>
  </div>
        <div className="grid grid-flow-col gap-4 md:absolute md:right-[10rem]">
          <p className="text-sm md:text-sm sm:text-xs">개인정보처리방침</p>
          <p className="text-sm md:text-sm sm:text-xs">이용약관</p>
        </div>
        <div className="text-xs md:text-sm sm:text-xs">©2024. 읽는곳곳 Co. All Rights Reserved. Prod By. SWYP</div>
      </footer>
    );
  }
  
  export default Footer;
  