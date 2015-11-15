#!/bin/bash

# Seuil haut demarrage du ventilo (40°C)
SEUIL_HAUT=40000
# Seuil bas arret du ventilo (35°C)
SEUIL_BAS=35000 #
TEMP=`cat /sys/class/thermal/thermal_zone0/temp`

gpio mode 0 out

# Boucle infinie
while true
do
	if [ $TEMP -gt $SEUIL_HAUT ]
	then
		gpio write 0 1
	fi
	if [ $TEMP -lt $SEUIL_BAS ]
	then
		gpio write 0 0
	fi

	# Attente de 30 sec avant la prochaine mesure
	sleep 30
	TEMP=`cat /sys/class/thermal/thermal_zone0/temp`
done
