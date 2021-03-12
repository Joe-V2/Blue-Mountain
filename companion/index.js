import * as messaging from "messaging";
import { me as companion } from "companion";
import { app } from "peer";


console.log("Running companion...");

messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Companion ready to receive messages!");
  });

if (
    !companion.permissions.granted("access_location") ||
    !companion.permissions.granted("run_background")
  ) {
    console.error("We're not allowed to access to GPS Position!");
  }
  
  // Monitor for significant changes in physical location
  companion.monitorSignificantLocationChanges = true;
  
  // Listen for the event
  companion.addEventListener("significantlocationchange", doThis);
  
  // Event happens if the companion is launched and has been asleep
  if (companion.launchReasons.locationChanged) {
    doThis(companion.launchReasons.locationChanged.position);
  }
  
  function doThis(position) {
    console.log(`Significant location change! ${JSON.stringify(position)}`);
    
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    {
        console.log("Socket is open! Activating geolocation cache override...");
        messaging.peerSocket.send("Message received from companion. Running command!");
    }
    
  if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
    console.log("ERROR: Companion cannot send message. Socket closed!")
  }
  }






