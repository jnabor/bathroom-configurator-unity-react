# specifify base image
FROM --platform=linux/amd64 node:16-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# install dependencies
RUN apt-get update && apt-get -y install gnupg wget && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN apt list --all-versions google-chrome-stable
# this will print the chromium version, update the puppeteer version in package.json s that it matches
# the supported chromium this list https://pptr.dev/chromium-support 

COPY package.json .
RUN npm install

COPY . ./
RUN npm run build

# default command
CMD ["npm", "run", "start"]
