build:
	docker build -t antoine/docker-lighthouse-express . --force-rm;

build-no-cache:
	docker build --no-cache  -t antoine/docker-lighthouse-express . --force-rm;

run:
	docker run -d \
	-p 3000:3498 -it \
	-v  $(shell pwd)/report:/home/chrome/reports \
	--cap-add=SYS_ADMIN antoine/docker-lighthouse-express 

dev:
	docker run  \
	-p 3008:3498 -it \
	-v  $(shell pwd)/report:/home/chrome/reports \
	-v  $(shell pwd)/app:/app-dev \
	--cap-add=SYS_ADMIN antoine/docker-lighthouse-express \
	/bin/sh