# Blue Mountain
 

based on code from @volkanto

 ![daywatch on wrist](https://media.discordapp.net/attachments/811209161911173121/819515814150930442/image0.jpg?width=682&height=910) ![nightwatch on wrist](https://media.discordapp.net/attachments/811209161911173121/819539409501290526/159787595_1122693368196010_6698247332293898003_n.png?width=512&height=910)
 
Watchface for the fitbit versa that does these things:

* Tracks the phase of the moon and displays it at night
* Calculates sunrise and sunset for the user, and displays the daylight and moonlight remaining as a rotation of the sun and moon 
* Changes the background and sprites to reflect the time of day

Known bugs:
* slight lag acquiring gps data for the first time

A companion app running in the fitbit smartphone app environment communicates significant location changes from a passive, low-accuracy geolocation api.
These changes fire an event that caches the new location to some text files on the watch, with one each for the user's new latitude and longitude.  
The watch environment has access to the SVG displayed on its face, and updates the elements based on a few calculations:   

* Whether or not the current time is between today's sunrise and sunset
* Whether or not the current time is between today's sunset and tomorrow's sunrise (before 12am in non-arctic timezones)
* Whether or not the current time is between yesterday's sunset and tomorrow's sunrise (after 12am in non-arctic timezones)
* This morning's phase of the moon, based on a value from the Julian calendar
* The current time as a percentage of day or night, defined between sunrises and sunsets

This allows the watch to not only update its background to a blue sky or a starry night, but also change the sun to a moon that reflects the current phase of the one outside, using the rotation
of the sprite to reflect the time as a progression from sunrise to sunset, or vice versa.

The geolocation API is only used if:
* an event is fired signalling the user has moved a significant distance (>5km), messaging a flag from the phone to the watch 
* there is no text file cached on the watch

In either case, the files are created containing a new location, the watch updates its sky and sun/moon with the new data from the resultant file, and then all continues as normal.    
This concurrent messaging approach significantly reduces use of the phone APIs, and markedly improves battery life as a result.  


To install:
* grab the fitbit simulator, a versa or versa 2
* connect it to the developer bridge
* open a terminal in the root of this repo and type "npx fitbit bi"
