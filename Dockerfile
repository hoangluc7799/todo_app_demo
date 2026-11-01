FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

# Mở cổng cho ứng dụng 
EXPOSE 3000

# Lệnh tự động chạy app khi bật container
CMD ["npm", "start"]