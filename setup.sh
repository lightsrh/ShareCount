#!/bin/bash
docker compose down
sleep 2
docker compose up -d
sleep 2
sudo apt install python3-psycopg2
python3 setup_db.py