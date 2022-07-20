#!/bin/bash
echo "beginning of installation..."
/var/tmp/setdata.sh &
/opt/keycloak/bin/kc.sh start-dev