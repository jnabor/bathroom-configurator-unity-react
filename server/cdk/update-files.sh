#!/bin/bash

echo "Copying files..."

rm -r ssr-webgl/*
rm -r cdk.out/*

cp -a ../ssr-webgl/src/ ssr-webgl/src/
cp ../ssr-webgl/package.json ssr-webgl/package.json
cp ../ssr-webgl/tsconfig.json ssr-webgl/tsconfig.json
cp ../ssr-webgl/.puppeteerrc.cjs ssr-webgl/.puppeteerrc.cjs