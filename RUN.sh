#!/bin/bash
docker run -d -p 3000:3498 -it -v $(pwd)/report:/home/chrome/reports --cap-add=SYS_ADMIN antoine/docker-lighthouse-express