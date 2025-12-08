#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run data ingestion for ChromaDB
python ingest_data.py

echo "Build completed successfully!"

