FROM femtopixel/google-chrome-headless:69.0.3497.100-i386

ARG VERSION=4.0.0-alpha.0
 

USER root

# Install deps + add Chrome Stable + purge all the things
RUN rm -rf /var/lib/apt/lists/* && \
  apt-get update && \
  apt-get remove gnupg -y && apt-get install --reinstall gnupg2 dirmngr --allow-unauthenticated -y && \
  apt-get autoclean && apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg --no-install-recommends && \
  curl -sSL https://deb.nodesource.com/setup_9.x | bash - && \
  apt-get update && apt-get install -y nodejs --no-install-recommends && \
  npm --global install npm && \
  npm --global install yarn && \
  apt-get purge --auto-remove -y curl gnupg && \
  rm -rf /var/lib/apt/lists/* && \
  npm install --global lighthouse && \
  mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

# some place we can mount and view lighthouse reports
VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

COPY entrypoint.sh /usr/bin/entrypoint


# Setup Express server 
WORKDIR /usr/src/app
COPY ./app/  /usr/src/app/
RUN npm install --unsafe-perm


WORKDIR /home/chrome/reports

# Run Chrome non-privileged
USER chrome

VOLUME /home/chrome/reports

# Drop to cli
#ENTRYPOINT ["entrypoint"]
#RUN node /usr/src/app/app.js &
CMD [ "node", "/usr/src/app/app.js" ]
