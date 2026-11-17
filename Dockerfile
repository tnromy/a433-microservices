# Gunakan base image Node.js versi 14
FROM node:14

# Hubungkan image dengan repository GitHub agar muncul di halaman Packages repository
LABEL org.opencontainers.image.source=https://github.com/tnromy/a433-microservices

# Tentukan working directory di dalam container
WORKDIR /app

# Salin seluruh source code ke working directory container
COPY . .

# Set environment: production mode dan gunakan item-db sebagai database host
ENV NODE_ENV=production DB_HOST=item-db

# Instal dependencies untuk production dan build aplikasi
RUN npm install --production --unsafe-perm && npm run build

# Ekspos port yang digunakan oleh aplikasi
EXPOSE 8080

# Jalankan server saat container diluncurkan
CMD ["npm", "start"]
