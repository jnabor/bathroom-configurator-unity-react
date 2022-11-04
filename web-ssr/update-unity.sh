#!/bin/bash

echo "Updating unity assets..."

rm -rf public/build/*
rm -rf public/StreamingAssets/*

cp -a ../unity/dist/Build/ public/build/
cp -a ../unity/dist/StreamingAssets/ public/StreamingAssets/
