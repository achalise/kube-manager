#!/usr/bin/env bash
cd api
npm run build
docker build --no-cache -t achalise/custom-app-manager:latest .