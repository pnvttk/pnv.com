// Called after form input is processed
function startConnect() {
  // Generate a random client ID
  clientID = "clientID-" + parseInt(Math.random() * 100);

  // Fetch the hostname/IP address and port number from the form
  host = "35.224.169.222"; // change to ip address
  port = "9001"; // change port
  usr = "admin"; // change username
  pwd = "admin"; // change pwd

  // Print output for the user in the messages div
  document.getElementById("messages").innerHTML +=
    "<span>Connecting to: " + host + " on port: " + port + "</span><br/>";
  document.getElementById("messages").innerHTML +=
    "<span>Using the following client value: " + clientID + "</span><br/>";

  // Initialize new Paho client connection
  client = new Paho.MQTT.Client(host, Number(port), clientID);

  // Set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // Authentication
  //client.username_pw_set("usr01", "usr01");

  // Connect the client, if successful, call onConnect function
  client.connect({
    onSuccess: onConnect,
    userName: usr,
    password: pwd,
  });
}

// Called when the client connects
function onConnect() {
  // Fetch the MQTT topic from the form
  topic = "pond"; // Change name of Main Topic in MQTT Box

  // Print output for the user in the messages div
  document.getElementById("messages").innerHTML +=
    "<span>Subscribing to: " + topic + "</span><br/>";

  // Subscribe to the requested topic
  client.subscribe(topic);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
  console.log("onConnectionLost: Connection Lost");
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost: " + responseObject.errorMessage);
  }
}

// Called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived: " + message.payloadString);
  document.getElementById("messages").innerHTML +=
    "<span>Subscribe| Topic: " +
    message.destinationName +
    "  | " +
    message.payloadString +
    "</span><br/>";
  updateScroll(); // Scroll to bottom of window
}

// Called when the disconnection button is pressed
function startDisconnect() {
  client.disconnect();
  document.getElementById("messages").innerHTML +=
    "<span>Disconnected</span><br/>";
  updateScroll(); // Scroll to bottom of window
}

// Updates #messages div to auto-scroll
function updateScroll() {
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}

function publish() {
  //read data from form
  pubMsg = document.getElementById("pubMsg").value;
  pubTopic = document.getElementById("optpond").value;
  optMsg = document.getElementById("optMsg").value;

  pubMsg = optMsg + pubMsg;

  //publish message
  message = new Paho.MQTT.Message(pubMsg);
  message.destinationName = pubTopic;
  client.send(message);

  //update textarea
  var showPub =
    "<span>Publish| Topic: " +
    pubTopic +
    " Message: " +
    pubMsg +
    "</span><br/>";
  document.getElementById("messages").innerHTML += showPub;
  updateScroll(); // Scroll to bottom of window
}
