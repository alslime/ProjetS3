#!/bin/bash

#processus d'attente du démarrage de keycloak et ajout des usagers

TIMEOUT_SECONDS=0
#LOGFILE=/server.log  attente de temps arbitraire

sleep ${TIMEOUT_SECONDS}s # grep -m 1  "listening on 0.0.0.0:8080" <(tail -f ${LOGFILE})
echo -e -n "\r"
echo "beginning of finalisation ...." #>> ${LOGFILE}
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/ --realm master --user admin --password admin
/opt/keycloak/bin/kcadm.sh create realms -s realm=usager -s enabled=true -o
/opt/keycloak/bin/kcadm.sh create clients -r master -f /var/tmp/frontend.json
/opt/keycloak/bin/kcadm.sh create clients -r master -f /var/tmp/backend.json
/opt/keycloak/bin/kcadm.sh create partialImport -r master -s ifResourceExists=OVERWRITE -f /var/tmp/users.json

echo -e -n "\r"
echo "server running ...." #>> ${LOGFILE}


