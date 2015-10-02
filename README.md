
        _   __          __           _   __                 __  ___                                                  __ 
       / | / /___  ____/ /__        / | / /___ ______      /  |/  /___ _____  ____ _____ ____  ____ ___  ___  ____  / /_
      /  |/ / __ \/ __  / _ \______/  |/ / __ `/ ___/_____/ /|_/ / __ `/ __ \/ __ `/ __ `/ _ \/ __ `__ \/ _ \/ __ \/ __/
     / /|  / /_/ / /_/ /  __/_____/ /|  / /_/ (__  )_____/ /  / / /_/ / / / / /_/ / /_/ /  __/ / / / / /  __/ / / / /_  
    /_/ |_/\____/\__,_/\___/     /_/ |_/\__,_/____/     /_/  /_/\__,_/_/ /_/\__,_/\__, /\___/_/ /_/ /_/\___/_/ /_/\__/  
                                                                                 /____/                                 
    --------------------------------------------------------------------------------------------------------------------


Welcome to your Node-Nas-Management (NNM) project (built on Cloud9 IDE!)

## What is Node-Nas-Management (NNM) ?

    Work In Progress
Imagined for Raspberry PI (RPI), Node-Nas-Management will transform your RPI into a real NAS with Node.JS

Node-Nas-Management is the first manager to NAS in Node.JS. Designed and built for Raspberry PI (RPI), but also suitable for Linux / Windows / Mac.

The project has three main areas of development :

* Ease of use
* Fast and Powerfull
* Modular and Maintainable

Naturally, the Node-Nas-Management solution contains all the basic functions and the advanced functions by default the most experienced initially.
And later by the "Modularity" project, the solution may be more complete.
Modules developed by community will see the day in addition to those developed by the original team that created the Node-NAS-Management solution.

Node-NAS-Management is a Rich Web Client based EXTJS technology (that provides a desktop interface inspire from office style) and Resumable.js
(beautiful JavaScript library providing multiple simultaneous, stable and resumable uploads via the HTML5 File API).

######This project is fully open source.


####What do you need to run NNM ?
For the moment NNM is planned and optimized to run on a RPI, however the project being carried by Node.js,
it should work anywhere as long as you have intalled the Node.js server.

In short, to run NNM, you must have:
* An RPI (or other more powerful computer)
* Node.js minimum v0.12.0
* If possible two identical disks or same size, for data redundancy (it is possible to have a single disc, but this is not recommended)
* Of course you fork NNM

After checking that you have all the prerequisites perform the following command to install all dependencies and project modules :

>npm intall

Then run the deamon :

>node server.js

This deamon run on the Env port or if is use, on the 3000 port.

####Cool ! But how do you use your new servicies, now ?

Is very simple, take your favorite web browser and go to your ip adress of your NAS

Exemple :

    192.168.0.18:3000
    
Remenber this servicies use the 3000 port (if the Env port is not use and not define).

The credential by default is :

ID :
>DarkAdmin

PassWord :
>darkadmin