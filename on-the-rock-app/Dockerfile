# 베이스 이미지로 Node.js 20 버전 사용
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Nginx 사용을 위한 베이스 이미지로 변경
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx의 루트 디렉토리로 복사
COPY --from=build /app/dist /app/dist

# 8765 포트 열기
EXPOSE 8765

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
