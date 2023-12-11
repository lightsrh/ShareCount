#!/bin/bash
docker compose down
sleep 2
docker compose up -d
python3 setup_db.py