# Base docker image
FROM debian:stretch-slim
LABEL name="chrome-headless" \
			maintainer="Justin Ribeiro <justin@justinribeiro.com>" \
			version="2.0" \
			description="Google Chrome Headless in a container"

# Install deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg \
	--no-install-recommends \
	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update && apt-get install -y \
	google-chrome-stable \
	fontconfig \
	fonts-ipafont-gothic \
	fonts-wqy-zenhei \
	fonts-thai-tlwg \
	fonts-kacst \
	fonts-symbola \
	fonts-noto \
	ttf-freefont \
	--no-install-recommends \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs \
	&& apt-get purge --auto-remove -y curl gnupg \
	&& rm -rf /var/lib/apt/lists/*


# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome && chown -R chrome:chrome /home/chrome \
		&& mkdir -p /opt/google/chrome && chown -R chrome:chrome /opt/google/chrome \
        && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome


# Setup Express server 
WORKDIR /usr/src/app
COPY ./app/  /usr/src/app/
RUN npm install --unsafe-perm

WORKDIR /home/chrome/reports


# Run Chrome non-privileged
USER chrome

VOLUME /home/chrome/reports

ENV REPORTS_PATH="/home/chrome/reports/"

# Drop to cli
#ENTRYPOINT ["entrypoint"]
#RUN node /usr/src/app/app.js &
CMD [ "node", "/usr/src/app/start.js" ]
#CMD ["bash"]

