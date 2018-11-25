#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#http}" != "$1" ]; then
    set -- lighthouse --enable-error-reporting --chrome-flags="--headless --disable-gpu" "$@"
fi

exec "$@"
