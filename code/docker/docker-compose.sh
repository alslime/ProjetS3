 #!/bin/bash
 
 docker-compose up -d
 sleep 5
 docker exec -it database sh /postgres/init.sh
