FROM golang:1.21.4 AS gobuild

# GOPATHでないところに移動
WORKDIR backend

COPY . .
# EXPOSE 1323

CMD ["go", "run", "main.go"]
