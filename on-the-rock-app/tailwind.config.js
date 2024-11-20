export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Tailwind가 스타일을 적용할 파일 경로
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8EEE1', // 메인 색상
        secondary: '#8090BF', // 어두운 보조 색상
        post: '#FFFCF7',
        check: '#99BF80',
        accent: '#F27D67', // 추가 강조 색상 (레드)
        background: '#F7C88A', // 웹사이트 배경 색상
        textPrimary: '#777777', // 주요 텍스트 색상
        textSecondary: '#646cff', // 보조 텍스트 색상
        textBlack: '#4D4D4D',
        textGray: '#CACACD',
      },
      fontFamily: {
        sans: ['Pretendard-Regular', 'Nanum Gothic', 'Noto Sans','Orbit', 'sans-serif'], // 전체적인 테마 폰트
        display: ['goorm-sans-bold', 'Gothic A1', 'Nanum Gothic', 'sans-serif'], // 제목 폰트
        code: ['Nanum Gothic Coding', 'monospace'], // 코드 블록에 사용할 폰트
      },
    },
  },
  plugins: [],
};