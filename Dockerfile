# Gunakan image Node.js resmi (alpine untuk ringan)
FROM node:20-alpine

# Install dependencies dasar jika perlu (biasanya tidak wajib untuk Next.js)
RUN apk add --no-cache bash

# Buat direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json dulu untuk caching layer install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Salin seluruh source code
COPY . .

# Expose port default Next.js
EXPOSE 3000

# Jalankan Next.js dalam mode production
CMD ["npm", "start"]