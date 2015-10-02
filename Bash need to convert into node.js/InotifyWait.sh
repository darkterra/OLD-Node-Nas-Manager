#!/bin/sh
/usr/bin/inotifywait -m -d -r -e create -e modify /media/USBHDD1/NAS01/MultiMedia --format "%e|%w%f" | while read res
do
	event=`echo $res | sed s/\|.*$//`
	src=`echo $res | sed s/^.*\|//`
	echo
	echo "Event : $event"
	echo "MAJ du propriétère ainsi que les modif des droits d'accès aux ficiers / dossiers : $src"
	sudo chown www-data:www-data -R /media/USBHDD1/NAS01/MultiMedia/
	sudo chmod 775 -R /media/USBHDD1/NAS01/MultiMedia/
done