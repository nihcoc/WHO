FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
COPY data/seed.js ./data/seed.js
ENV PORT=3000
EXPOSE 3000
VOLUME /app/data/runtime
CMD ["node","src/server/app.js"]
