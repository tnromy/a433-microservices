#!/bin/bash

# Script untuk build dan push Docker image ke GitHub Packages (GHCR)

# Build Docker image dari Dockerfile dengan nama item-app dan tag v1
docker build -t item-app:v1 .

# Lihat daftar image di lokal
docker images

# Ubah nama (tag) image agar sesuai dengan format GitHub Packages (GHCR)
docker tag item-app:v1 ghcr.io/tnromy/item-app:v1

# Login ke GitHub Container Registry via Terminal
echo $CR_PAT | docker login ghcr.io -u tnromy --password-stdin

# Unggah (push) image ke GitHub Packages (GHCR)
docker push ghcr.io/tnromy/item-app:v1
