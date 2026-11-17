# Gunakan base image Node.js 18 versi Alpine yang ringan
FROM node:18-alpine

# Tentukan working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu agar layer dependency bisa di-cache
COPY package*.json ./

# Install dependency untuk production saja (tanpa devDependencies)
RUN npm ci --omit=dev

# Salin seluruh source code aplikasi ke working directory
COPY . .

# Set mode production dan port aplikasi (sesuai nilai PORT di .env)
ENV NODE_ENV=production PORT=3001

# Ekspos port yang digunakan oleh shipping-service
EXPOSE 3001

# Jalankan aplikasi saat container diluncurkan
CMD ["node", "index.js"]
