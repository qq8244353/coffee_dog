ID=$(env DEV=true sudo docker run -d -p 1324:1324 -t coffee_dog_backend)
sudo docker logs -f ${ID}
