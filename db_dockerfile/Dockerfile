# syntax=docker/dockerfile:1
FROM postgres:12-alpine

COPY ./pg-init-scripts/create-multiple-db.sh docker-entrypoint-initdb.d/create-multiple-db.sh

