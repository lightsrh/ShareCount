#!/bin/bash
newgrp docker
docker compose down
sleep 2
docker compose up -d
sleep 2
python3 setup_db.py