#! /bin/bash

##########################################
#            Backup_Img_Master           #
##########################################

# Variables
PORT="1234"

IPMaster=$(ip addr | grep eth0 | grep inet | sed 's/^\s*//' | cut -d'/' -f1 | cut -d' ' -f2)
Chemin="/home/pi/"
NomProgramme="Backup_Img_Exclave.sh"
NomProgrammeRemote="Backup_Img_Exclave-Remote.sh"

DESTINATION="/media/USBHDD1/NAS01/Private/BackupRasp/"
DESTINATIONLOG="/home/pi/Logs/"
NOMLOG="Backup_Img_Master.log"
DESTINATIONCONF="/home/pi/"
NOMCONF="Backup_Conf_Img_Master.conf"

DateGlobaleDebut=`date "+%s"`
NbrImages=0

# Fonctions
log()
{
	# Variables locale
	local destination=$DESTINATIONLOG$NOMLOG

	if [ "$2" = "Conf" ] || [ "$3" = "Conf" ]
	then
		destination=$DESTINATIONCONF$NOMCONF
	fi

	if [ "$2" = "First" ]
	then
		echo $1 > $destination 2>&1
	elif [ "$1" != "First" ] && [ "$1" != "\n" ] && [ "$1" != "Conf" ]
	then
		echo $1 >> $destination 2>&1
	elif [ "$1" = "\n" ]
	then
		echo "" >> $destination 2>&1
	fi
}

cadreLog()
{
	# Variables locale
	local nombreCaracteres="0"
	local first="No"
	local conf="No"
	local espaces=""
	local espacesI=""
	local tirets=""

	# Calcul du plus grand nombre de caractères
	for i in "$@"
	do
		if [ $nombreCaracteres -lt $(($(echo $i | wc -m) - 1)) ]
		then
			nombreCaracteres=$(($(echo $i | wc -m) - 1))
		fi
		if [ "$i" = "First" ]
		then
			first="First"
		fi
		if [ "$i" = "Conf" ]
		then
			conf="Conf"
		fi
	done
	
	# Génération & stockage du nombre de tirets
	tirets=$(printf "|%$(($nombreCaracteres + 4))s|\n" "" | sed s/' '/"-"/g)
	
	# Génération de l'entête
	if [ "$first" = "First" ]
	then
		log $tirets $first $conf
		first="No"
	else
		log "\n"
		log $tirets $first $conf
	fi
	
	for i in "$@"
	do
		if [ "$i" != "First" ] && [ "$i" != "Conf" ]
		then
			espaces=$(printf "%$(($(($nombreCaracteres + 3 - $(echo $i | wc -m)))/2))s\n" "" |  sed s/' '/'\xc2\xa0'/g)
			espacesI=$(printf "%$(($(($nombreCaracteres + 5 - $(echo $i | wc -m)))/2))s\n" "" |  sed s/' '/'\xc2\xa0'/g)

			if [ $(($(($nombreCaracteres + 3 - $(echo $i | wc -m))) % 2)) -eq 0 ]
			then
				log "|-$espaces$i$espaces-|" $conf
			else
				log "|-$espaces$i$espacesI-|" $conf
			fi
		fi
	done
	log $tirets $conf
	log "\n"
}

testDirectory()
{
	if [ ! -d "$1" ]
	then
		# Création du dossier
		sudo mkdir $1

		#echo "Dosser: $1 créer"
		log "Dosser: $1 créer"
	else
		#echo "Dossier: $1 déjà existant..."
		log "Dossier: $1 déjà existant..."
	fi
}

testFile()
{
	if [ -f "$1" ]
	then
		echo "Ok"
		log "Fichier: $1 existant"
	else
		echo "Ko"
		log "Fichier: $1 non existant..."
	fi
}

lectureConf()
{
	if [ $# -eq 1 ]
	then
		# Vérification si le fichier de Conf est présent
		if [ "$(testFile $1)" != "Ok" ]
		then
			cadreLog "Bonjour bienvenue dans le fichier de configuration" "c'est ici qu'il faut remplir les informations" "pour pouvoir faire fonctionner ce programme" "" "Exemple:" "" "NomClient[1] --> RaspTest01" "IPClient[1] --> 192.168.0.31" "TypeClient (OS)[1] --> Raspbian" "NomClient[2] --> RaspTest05" "IPClient[2] --> 192.168.0.36" "TypeClient (OS)[2] --> RaspBMC" "Conf"
		fi
		if [ "$(testFile $1)" = "Ok" ]
		then
			local i=0

			while read ligne
			do
				if [[ ! $ligne == *"|"* ]]
				then
					#echo "$i : $ligne"
					InfoConf[$i]=$ligne
					i=$((i + 1))
				fi
			done < $1
		fi
	fi
}

clientPing()
{
	if [ $# -eq 1 ]
	then
		echo $(ping -c 1 $1 | grep % | cut -d, -f3 | cut -d' ' -f2)
	else
		echo "Il n'y a pas le bon nombre d'arguments"
	fi
}

programmeExist()
{
	if [ $# -eq 1 ]
	then
		local retour=$(ssh pi@$1 "bash -c 'if [ -f $NomProgramme ]; then echo "Ok"; else echo "Ko"; fi'")

		log "Vérification si le client détient le programme $NomProgramme"
		if [ "$retour" = "Ok" ]
		then
			echo "Ok"
			log "Programme $NomProgramme est présent."
		else
			echo "Ko"
			log "Programme $NomProgramme n'est pas présent"
		fi
	else
		echo "Il n'y a pas le bon nombre d'arguments"
	fi
}

clientVerificator()
{
	if [ $# -eq 1 ]
	then
		#Suppression du fichier remote du master
		log "Suppression du fichier remote du master"
		rm -fr $Chemin$NomProgrammeRemote

		if [ "$(programmeExist $1)" = "Ok" ]
		then
			log "Vérification si le programme $NomProgramme est a jours"

			# On récupère une copie du fichier pour le comparer avec la référence
			scp pi@$1:$Chemin$NomProgramme $Chemin$NomProgrammeRemote

			# Comparaison des deux fichiers
			cmp $Chemin$NomProgramme $Chemin$NomProgrammeRemote

			if [ $? -eq 0 ]
			then
				log "Le programme est à jour."
			else
				log "le programme n'est pas à jour --> Copie du programme référence sur le client"
				scp $Chemin$NomProgramme pi@$1:$Chemin$NomProgramme
			fi
		else
			# Copie du programme de référence sur le client
			log "--> Copie du programme référence sur le client"
			scp $Chemin$NomProgramme pi@$1:$Chemin$NomProgramme
		fi

		#Suppression du fichier remote du master
		log "Suppression du fichier remote du master"
		rm -fr $Chemin$NomProgrammeRemote
	else
		echo "Il n'y a pas le bon nombre d'arguments"
	fi
}

delta()
{
	if [ $# -eq 2 ]
	then
		# Calcul du Delta
		echo `date --utc -d @$(($2 - $1)) "+%H:%M:%S"`
	else
		echo "0"
	fi
}


# Main

# Deplacement de la console sur le bon dosser
cd /home/pi

# Vérification si le dosser de log est présent sur le Master
testDirectory "Logs"

# Initialisation du fichier de log
cadreLog "Demarage du scpipt $0" "`date '+%d/%m/%y %H:%M:%S'`" "First"
log "\n"

# Lecture du fichier de Conf
lectureConf $NOMCONF
NbrClient=${#InfoConf[*]}

# Kill de toute communication déjà ouverte avec NetCat
log "Kill de toute communication déjà ouverte avec NetCat"
log $(pkill netcat)

# Contacte des clients présents et copie des images
for ((j=0; $j < $NbrClient; j=$(($j + 3))))
do
	NameClient=${InfoConf[$j]}
	IPClient=${InfoConf[$(($j + 1))]}
	TypeClient=${InfoConf[$(($j + 2))]}
	
	# Vérification si le client est présent sur le réseau et si il est a jour !
	if [ "$(clientPing $IPClient)" = "0%" ]
	then
		log "Le Client $NameClient est bien présent sur le réseau"
		
		# +1 dans le compteur d'images
		NbrImages=$(($NbrImages + 1))
		
		# Vérification si le programme client est présent
		clientVerificator $IPClient
		
		cadreLog "Demarage de la reception de l'image..." "$NameClient" "`date '+%d/%m/%y %H:%M:%S'`"
		DateDebut=`date "+%s"`


		cd $DESTINATION
		testDirectory $NameClient
		cd /home/pi

		
		# Début du Transfert
		/bin/netcat -l -d -p $PORT | sudo /bin/dd of="$DESTINATION$NameClient/$TypeClient-`date +%d-%m-%Y`.img" &
		/usr/bin/ssh pi@$IPClient ./$NomProgramme $IPMaster $PORT $NameClient
		
		DateFin=`date "+%s"`
		cadreLog "`date`" "Fin de la reception de l'image..." "Temps de transfert : $(delta $DateDebut $DateFin)"

	# Si le client est absent du réseau
	else
		cadreLog "Tentative de connexion avec..." "$NameClient" "`date`" "Connexion impossible"
	fi
	
	###
	echo "Attente d'une seconde pour laisser le temps a netcat de fermer le port d'ecoute"
	log "Attente d'une seconde pour laisser le temps a netcat de fermer le port d'ecoute"
	sleep 1
	###

	# Compression de l'Image
	log "Compression de l'image $TypeClient-`date +%d-%m-%Y`.img du client : $NameClient"
	
	sudo gzip "$DESTINATION$NameClient/$TypeClient-`date +%d-%m-%Y`.img"
	
	DateGlobaleFin=`date "+%s"`
	cadreLog "`date`" "Fin du programme de Backup..." "Temps de transfert total : $(delta $DateGlobaleDebut $DateGlobaleFin)"
done

# Fin du programme
