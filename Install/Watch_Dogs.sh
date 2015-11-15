#!/bin/sh
### BEGIN INIT INFO
# Provides:          Watch_Dogs
# Required-Start:    $all
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Permet la MAJ du propriétère ainsi que les modif des droits d'accès
### END INIT INFO

#-------------------------------------------------#
#                 Début du Script
#-------------------------------------------------#

# Variables
DIR="/media/USBHDD1/NAS01/MultiMedia"
EVENT_WATCH="create,modify"
FIFO="/tmp/inotify2.fifo"

# Fonctions
on_event()
{
	local event=$1
	local src=$2

	sleep 5

	echo "Event : $event" >> /home/pi/Logs/Watch_Dogs.log
	echo "MAJ du propriétère ainsi que les modif des droits d'accès aux ficiers / dossiers : $src" >> /home/pi/Logs/Watch_Dogs.log

	sudo chown www-data:www-data -R /media/USBHDD1/NAS01/MultiMedia/
	sudo chmod 775 -R /media/USBHDD1/NAS01/MultiMedia/
}

on_exit()
{
	kill $INOTIFY_PID
	rm $FIFO
	exit
}

start()
{
	# Main
	if [ ! -e "$FIFO" ]
	then
		mkfifo "$FIFO"
	fi

	echo >> /home/pi/Logs/Watch_Dogs.log
	echo $"----------------------------------------------" >> /home/pi/Logs/Watch_Dogs.log
	echo $"              Starting inotifywait" >> /home/pi/Logs/Watch_Dogs.log
	echo $ `date` >> /home/pi/Logs/Watch_Dogs.log
	echo $"----------------------------------------------" >> /home/pi/Logs/Watch_Dogs.log
	echo >> /home/pi/Logs/Watch_Dogs.log

	inotifywait -m -r -e "$EVENT_WATCH" "$DIR" --format "%e|%w%f" > "$FIFO" &
	INOTIFY_PID=$!

	trap "on_exit" 2 3 15

	while read res
	do
		event=`echo $res | sed s/\|.*$//`
		src=`echo $res | sed s/^.*\|//`

		on_event $event $src &

		#echo >> /home/pi/Logs/Watch_Dogs.log
		#echo "Event : $event" >> /home/pi/Logs/Watch_Dogs.log
		#echo "MAJ du propriétère ainsi que les modif des droits d'accès aux ficiers / dossiers : $src" >> /home/pi/Logs/Watch_Dogs.log
		#sudo chown www-data:www-data -R /media/USBHDD1/NAS01/MultiMedia/
		#sudo chmod 775 -R /media/USBHDD1/NAS01/MultiMedia/
	done < "$FIFO"
}
stop()
{
	echo $"----------------------------------------------" >> /home/pi/Logs/Watch_Dogs.log
	echo $"              Stopping inotifywait" >> /home/pi/Logs/Watch_Dogs.log
	echo $ `date` >> /home/pi/Logs/Watch_Dogs.log
	echo $"----------------------------------------------" >> /home/pi/Logs/Watch_Dogs.log
	echo >> /home/pi/Logs/Watch_Dogs.log
	sudo /usr/bin/killall -w inotifywait

	on_exit
}

case $1 in
        start)
                start &
        ;;
        stop)
                stop
        ;;
        restart)
                stop
		start &
        ;;
	*)
		echo $"Usage: $0 {start|stop|restart}"
		exit 1
esac

#-------------------------------------------------#
#                  Fin du Script
#-------------------------------------------------#
