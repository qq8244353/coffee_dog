FROM golang:1.23.3 AS gobuild
RUN apt-get update && \
    apt-get install -y vim iputils-ping net-tools default-mysql-client

# GOPATHでないところに移動
WORKDIR backend

COPY . .
# EXPOSE 1323

CMD ["go", "run", "main.go"]
