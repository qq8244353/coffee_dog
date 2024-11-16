set -x
export $(cat .env)
ID=$(docker container ls --filter "name=mysql_host" | awk '{print $1}' | tail -n 1)
docker exec -it ${ID} mysql -uroot -p${MYSQL_ROOT_PASSWORD} coffee_dog
