

        _   __          __           _   __                 __  ___                                 
       / | / /___  ____/ /__        / | / /___ ______      /  |/  /___ _____  ____ _____ ____  _____
      /  |/ / __ \/ __  / _ \______/  |/ / __ `/ ___/_____/ /|_/ / __ `/ __ \/ __ `/ __ `/ _ \/ ___/
     / /|  / /_/ / /_/ /  __/_____/ /|  / /_/ (__  )_____/ /  / / /_/ / / / / /_/ / /_/ /  __/ /    
    /_/ |_/\____/\__,_/\___/     /_/ |_/\__,_/____/     /_/  /_/\__,_/_/ /_/\__,_/\__, /\___/_/     
                                                                                 /____/             
    ------------------------------------------------------------------------------------------------

Welcome to your Node-Nas-Manager (NNM) project (built on Cloud9 IDE!)

## What is Node-Nas-Manager (NNM) ?

    Work In Progress
    
    http://node-nas-manager-darkterra.c9users.io
    
    Install Env :
      - sudo raspi-config
        => select (Expand Filesystem) than REBOOT !
      - sudo apt-get update && sudo apt-get upgrade -y
      - sudo rpi-update (than REBOOT !)
      
                    (For RPI ARMV6 (RPI A, A+, B, B+, ZERO)
      - wget https://nodejs.org/dist/latest/node-v5.3.0-linux-armv6l.tar.gz
      - tar -xvf node-v5.3.0-linux-armv6l.tar.gz
      - cd node-v5.3.0-linux-armv6l/
      - sudo cp -R * /usr/local/
      - suro rm -fr node-v5.3.0-linux-armv6l
      
      
                    (A Supprimer ?)
      - curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
      - sudo apt-get install -y nodejs
      
      
      
      - sudo npm install -g npm
      - git clone https://github.com/darkterra/Node-Nas-Manager.git
      - sudo npm install
      - pm2 link g44tyerwetm3ex3 mi2ku55gmqeehe4 [ServerName]
      
      
      
      - https://app.keymetrics.io/#/bucket/567ecee7136fc0ed30190d8a/dashboard
      - http://pm2.keymetrics.io/docs/usage/quick-start/
      
      
      
      - TheMovieDB API KEY : 030aa3a0192fff64bad4b5465fabcb11
      - Exemple : 'http://api.themoviedb.org/3/search/multi?query=star+wars&api_key=030aa3a0192fff64bad4b5465fabcb11&page=1&language=fr&include_image_language=fr'
      - Img Exemple : 'http://image.tmdb.org/t/p/w92/vRYYRyKOFN7UsOD7d8tiv5xicOm.jpg'
      - See : 'http://webix.com/widget/dataview/'
      
      
      
      - Make nodeScript for first install (Modify /boot/config.txt => overclock; gpuRAM)
          # Modification by DarkTerra (for RPI B)
          arm_freq=1000
          core_freq=500
          sdram_freq=600
          over_voltage=6
      - And modify (/lib/systemd/system/getty@.service)
          ExecStart=-/sbin/agetty --noclear %I $TERM
      - And exec this (sudo systemctl set-default multi-user) than REBOOT !

Imagined for Raspberry PI (RPI), Node-Nas-Manager will transform your RPI into a real NAS with Node.JS

Node-Nas-Manager is the first manager to NAS in Node.JS. Designed and built for Raspberry PI (RPI), but also suitable for Linux / Windows / Mac.

The project has three main areas of development :

* Ease of use
* Fast and Powerfull
* Modular and Maintainable

Naturally, the Node-Nas-Manager solution contains all the basic functions and the advanced functions by default the most experienced initially.
And later by the "Modularity" project, the solution may be more complete.
Modules developed by community will see the day in addition to those developed by the original team that created the Node-Nas-Manager solution.

Node-Nas-Manager is a Rich Web Client based Webix technology (that provides a desktop interface inspire from office style) and Resumable.js
(beautiful JavaScript library providing multiple simultaneous, stable and resumable uploads via the HTML5 File API).

######This project is fully open source.


####What do you need to run NNM ?
For the moment NNM is planned and optimized to run on a RPI, however the project being carried by Node.js,
it should work anywhere as long as you have intalled the Node.js server (Soon!).

In short, to run NNM, you must have:
* An RPI (or other more powerful computer)
* Node.js minimum v5.3.0
* If possible two identical disks or same size, for data redundancy (it is possible to have a single disc, but this is not recommended)
* Of course you clone NNM

After checking that you have all the prerequisites perform the following command to install all dependencies and project modules :

>npm intall

Then run the deamon :

>node server.js

This deamon run on the Env port or if is use, on the 3000 port.

####Cool ! But how do you use my new servicies, now ?

Is very simple, take your favorite web browser and go to your ip adress of your NAS

Exemple :

    192.168.0.18:3000
    
Remenber this servicies use the 3000 port (if the Env port is not use and not define).

The credential by default is :

ID :
>NNM-Admin

PassWord :
>nnm-admin