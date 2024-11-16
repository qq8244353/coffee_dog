ID=$(sudo docker run -d -t coffee_dog_backend)
sudo docker logs -f ${ID}
