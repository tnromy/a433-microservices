#!/bin/bash
# Script untuk build dan push Docker image frontend Karsa Jobs (karsajobs-ui) ke GitHub Packages (GHCR)

# Hentikan script bila ada perintah yang gagal
set -e

# Nama image lengkap sesuai format GitHub Packages: ghcr.io/<username>/<nama-image>:<tag>
IMAGE_NAME=ghcr.io/tnromy/karsajobs-ui:latest

# Build Docker image dari Dockerfile di direktori ini.
# Label org.opencontainers.image.source menautkan package ke repository GitHub.
docker build \
  --label org.opencontainers.image.source=https://github.com/tnromy/a433-microservices \
  -t "$IMAGE_NAME" .

# Login ke GitHub Container Registry menggunakan Personal Access Token
# yang disimpan di environment variable CR_PAT (agar token tidak tertulis di script)
echo "$CR_PAT" | docker login ghcr.io -u tnromy --password-stdin

# Unggah (push) image ke GitHub Packages
docker push "$IMAGE_NAME"
