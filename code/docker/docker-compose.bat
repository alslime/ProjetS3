 docker-compose up -d
 timeout /t 5 /nobreak
 docker exec -it database sh /postgres/init.sh
 exit
