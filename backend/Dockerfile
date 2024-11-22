FROM golang:1.23.3 AS gobuild
RUN apt-get update && \
    apt-get install -y vim iputils-ping net-tools default-mysql-client

# GOPATHでないところに移動
WORKDIR backend

# 時刻を合わせるためののもの
ADD https://github.com/golang/go/raw/master/lib/time/zoneinfo.zip /usr/local/go/lib/time/zoneinfo.zip

COPY . .
# EXPOSE 1323

CMD ["go", "run", "main.go"]
