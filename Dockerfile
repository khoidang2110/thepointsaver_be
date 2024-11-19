# B1: Build môi trường Node.js
FROM node:20

# B2: Tạo folder ứng dụng trong Docker container
WORKDIR /app

# B3: Copy các file package.json và package-lock.json
COPY package*.json ./

# B3.1: Copy thư mục prisma nếu bạn dùng Prisma
COPY prisma ./prisma/

# B3.2: Copy toàn bộ source code vào trong Docker image
COPY . .

# B4: Cài đặt các dependencies từ package.json
RUN npm install

# B5: Build ứng dụng NestJS (nếu ứng dụng của bạn sử dụng TypeScript)
RUN npm run build  

# B6: Expose cổng cho bên ngoài kết nối vào
EXPOSE 8083

# B7: Start server trong Docker container
CMD ["npm", "run", "start:prod"]  