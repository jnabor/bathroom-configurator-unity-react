#!/bin/sh

echo "Starting X virtual framebuffer using: Xvfb $DISPLAY -ac -screen 0 $XVFB_WHD -nolisten tcp"
Xvfb $DISPLAY -ac -screen 0 $XVFB_WHD -nolisten tcp &

echo 'Starting server-side webgl server...'
npm run start