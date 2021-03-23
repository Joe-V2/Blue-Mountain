![thumbnimg](https://repository-images.githubusercontent.com/346151660/15870a00-8253-11eb-893e-167c5fe2c80c)

A companion app running in the fitbit smartphone app environment communicates significant location changes from a passive, low-accuracy geolocation api. These changes fire an event that caches the new location to some text files on the watch, with one each for the user's new latitude and longitude.
The watch environment has access to the SVG displayed on its face, and updates the elements based on a few calculations:

- Whether or not the current time is between today's sunrise and sunset
- Whether or not the current time is between today's sunset and tomorrow's sunrise (before 12am in non-arctic timezones)
- Whether or not the current time is between yesterday's sunset and tomorrow's sunrise (after 12am in non-arctic timezones)
- This morning's phase of the moon, based on a value from the Julian calendar
- The current time as a percentage of day or night, defined between sunrises and sunsets

This allows the watch to not only update its background to a blue sky or a starry night, but also change the sun to a moon that reflects the current phase of the one outside, using the rotation of the sprite to reflect the time as a progression from sunrise to sunset, or vice versa.

The geolocation API is only used if:

- an event is fired signalling the user has moved a significant distance (>5km), messaging a flag from the phone to the watch
- there is no text file cached on the watch

In either case, the files are created containing a new location, the watch updates its sky and sun/moon with the new data from the resultant file, and then all continues as normal.
This concurrent messaging approach significantly reduces use of the phone APIs, and markedly improves battery life as a result.
