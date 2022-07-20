#!/bin/bash
timeout 300 /bin/bash -c 'until curl -sI -o /dev/null -w "%{http_code}\n" localhost:8080; do sleep 5; done;'
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/ --realm master --user keycloak --password keycloak
/opt/keycloak/bin/kcadm.sh create realms -s realm=Validation -s enabled=true -o
/opt/keycloak/bin/kcadm.sh create clients -r Validation -f /var/tmp/frontend.json
/opt/keycloak/bin/kcadm.sh create clients -r Validation -f /var/tmp/backend.json
/opt/keycloak/bin/kcadm.sh create partialImport -r Validation -s ifResourceExists=OVERWRITE -f /var/tmp/users.json

echo -e -n "\r"
echo "Server running."




