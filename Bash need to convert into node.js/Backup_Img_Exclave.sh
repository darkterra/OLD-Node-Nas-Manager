#! /bin/bash

##########################################
#           Backup_Img_Exclave           #
##########################################

# Variables
Chemin="/home/pi"
DESTINATIONLOG="/home/pi/Logs"

# Fonctions
testDirectory()
{
	if [ ! -d "$1" ]
	then
		# Création du dossier
		mkdir $1

		echo "Dosser: $1 créer" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
	else
		echo "Dossier: $1 déjà existant..." >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
	fi
}


# Main

# Deplacement de la console sur le bon dosser
cd $Chemin

# Vérification si le dosser de log est présent sur le Master
testDirectory "Logs"

echo "Nombre de parametres: $# ..." >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1

if [ $# -eq 3 ]
then
    echo "-------------------------------------------------" > $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "      Demarage de la copie de l'image..." >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "      $3" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "         `date`" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "-------------------------------------------------" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    
    sudo dd if=/dev/mmcblk0 | netcat $1 $2
    
    echo "-------------------------------------------------" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "         `date`" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "        Fin de la copie de l'image..." >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
    echo "-------------------------------------------------" >> $DESTINATIONLOG/Backup_Img_Exclave.log 2>&1
fi