#!/bin/bash
sudo mkdir -pv /var/{log,run}/gunicorn/
sudo chown -cR meadowse:meadowse /var/{log,run}/gunicorn/
source ~/.DJANGO_SECRET_KEY
gunicorn -c config/gunicorn/dev.py
tail -f /var/log/gunicorn/dev.log