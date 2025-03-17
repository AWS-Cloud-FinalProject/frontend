# 1. Node.js 환경에서 React 앱 빌드
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . . 
RUN DISABLE_ESLINT_PLUGIN=true npm run build

# 2. Nginx를 이용해 정적 파일 제공 + API 프록시 설정
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  # Nginx 설정 추가
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]