/* Magic Mirror
 * Node Helper: MMM-JustForTodayMeditation
 *
 * By = LeftBrain
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require("request");

var jftResult = "No Result Found";

module.exports = NodeHelper.create({
  // Subclass start method.
  start: function () {
    console.log("Started node_helper.js for MMM-JustForTodayMeditation.");
  },

  socketNotificationReceived: function (notification, payload) {
    console.log(
      this.name +
        " node helper received a socket notification: " +
        notification +
        " - Payload: " +
        payload
    );
    this.processJftRequest();
  },

  processJftRequest: function (version) {
    var self = this;

    var jftUrl = "http://www.jftna.org/jft/";

    request({ url: jftUrl, method: "GET" }, function (error, response, body) {
      switch (response.statusCode) {
        case 200:
          console.log("[JFT] RequestSuccess --> Response: " /* + body*/);

          // If you want the full read-out, uncomment this line 
          // and comment the next two below
          //var result = body;
          
          var regEx = new RegExp(/\<b\>Just for Today: \<\/b\>[^\<]*/g);
          var result = body.match(regEx);

          console.log("[JFT] " + result);

          self.sendSocketNotification("JFT_RESULT", result);
          break;

        default:
          if (error) {
            console.error(
              "[JFT] An error occurred while contacting jft webserver: " + error
            );
          } else {
            console.warn(
              "[JFT] Unknown Failure: \nResponseCode: " +
                response.statusCode +
                "\nResponseMessage: " +
                response.message
            );
          }
      }
    });
  },

  // Override socketNotificationReceived method.

  /* socketNotificationReceived(notification, payload)
   * This method is called when a socket notification arrives.
   *
   * argument notification string - The identifier of the noitication.
   * argument payload mixed - The payload of the notification.
   */
  socketNotificationReceived: function (notification, payload) {
    // if (notification === "MMM-JustForTodayMeditation-NOTIFICATION_TEST") {
    // 	console.log("Working notification system. Notification:", notification, "payload: ", payload);
    // 	// Send notification
    // 	this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
    // }

    console.log(
      this.name +
        " node helper received a socket notification: " +
        notification +
        " - Payload: " +
        payload
    );
    this.processJftRequest();
  }

  // // Example function send notification test
  // sendNotificationTest: function(payload) {
  // 	this.sendSocketNotification("MMM-JustForTodayMeditation-NOTIFICATION_TEST", payload);
  // },

  // // this you can create extra routes for your module
  // extraRoutes: function() {
  // 	var self = this;
  // 	this.expressApp.get("/MMM-JustForTodayMeditation/extra_route", function(req, res) {
  // 		// call another function
  // 		values = self.anotherFunction();
  // 		res.send(values);
  // 	});
  // },

  // // Test another function
  // anotherFunction: function() {
  // 	return {date: new Date()};
  // }
});
