Homedir="pi"

if [ -e /home/$Homedir/rsyncjob.lock ]
then
  echo "Rsync job already running...exiting"
  exit
fi

# Create the lock file
touch /home/$Homedir/rsyncjob.lock

# Your code in here
sudo rsync -av --delete-after --exclude=NAS01/Private/Torrent/ /media/USBHDD1/ /media/USBHDD2/ > /home/pi/Logs/rsync.log

if [ $? -ne 0 ]
then
	echo $?
else
	echo "BackUp Done..."
fi

# Delete lock file at end of your job
rm /home/$Homedir/rsyncjob.lock
