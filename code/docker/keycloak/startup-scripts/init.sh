<<<<<<< HEAD
##!/bin/bash
=======
#!/bin/bash
# Appel du processus d'attente du démarrage de keycloak et ajout des usage
>>>>>>> 1cad672c0d27c7ec875711dd5b911f5a20cca354
echo "beginning of installation..."
/var/tmp/setdata.sh &
/opt/keycloak/bin/kc.sh start-dev