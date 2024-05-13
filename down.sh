#!/bin/bash
kill "$(cat /var/run/gunicorn/prod.pid)"