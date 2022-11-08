# specifify base image
FROM --platform=linux/amd64 node:16-slim

# docker run --rm -it --entrypoint bash  node:16-slim
# apt list --all-versions google-chrome-stable
# this will print the chromium version, update the puppeteer version in package.json s that it matches
# the supported chromium this list https://pptr.dev/chromium-support 

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# install dependencies
RUN apt-get update && apt-get -y install gnupg wget xvfb && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .
RUN npm install

COPY . ./
RUN npm run build

RUN chmod +x entrypoint.sh

ENV CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV NODE_OPTIONS=--max_old_space_size=30000 --max-http-header-size=80000
ENV XVFB_WHD=1200x1200x16
ENV DISPLAY=:99

ENTRYPOINT ["/entrypoint.sh"]
