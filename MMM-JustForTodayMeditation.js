/* global Module */

/* Magic Mirror
 * Module: MMM-JustForTodayMeditation
 *
 * By =
 * MIT Licensed.
 */

Module.register("MMM-JustForTodayMeditation", {
  defaults: {
    updateInterval: 1000 * 60 * 60 * 3, // every 3 hours
    retryDelay: 5000
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  start: function () {
    var self = this;
    var jftResult = "";

    Log.info("Starting module: " + this.name);
    var self = this;

    var configuredVersion = this.config.version;

    //Do this once first
    self.sendSocketNotification("GET_JFT", null);

    //Then every hour
    setInterval(function () {
      self.sendSocketNotification("GET_JFT", configuredVersion);
    }, this.config.updateInterval); //perform every hour (3600000 milliseconds)

    // var dataRequest = null;
    // var dataNotification = null;

    // //Flag for check if module is loaded
    // this.loaded = false;

    // // Schedule update timer.
    // this.getData();
    // setInterval(function() {
    // 	self.updateDom();
    // }, this.config.updateInterval);
  },

  /*
   * getData
   * function example return data and show it in the module wrapper
   * get a URL request
   *
   */
  getData: function () {
    var self = this;

    var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
    var retry = true;

    var dataRequest = new XMLHttpRequest();
    dataRequest.open("GET", urlApi, true);
    dataRequest.onreadystatechange = function () {
      console.log(this.readyState);
      if (this.readyState === 4) {
        console.log(this.status);
        if (this.status === 200) {
          self.processData(JSON.parse(this.response));
        } else if (this.status === 401) {
          self.updateDom(self.config.animationSpeed);
          Log.error(self.name, this.status);
          retry = false;
        } else {
          Log.error(self.name, "Could not load data.");
        }
        if (retry) {
          self.scheduleUpdate(self.loaded ? -1 : self.config.retryDelay);
        }
      }
    };
    dataRequest.send();
  },

  /* scheduleUpdate()
   * Schedule next update.
   *
   * argument delay number - Milliseconds before next update.
   *  If empty, this.config.updateInterval is used.
   */
  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
    nextLoad = nextLoad;
    var self = this;
    setTimeout(function () {
      self.getData();
    }, nextLoad);
  },

  getDom: function () {
    console.log("[JFT] Updating DOM");

    // create element wrapper
    var wrapper = document.createElement("div");

    if (this.jftResult) {
      var wrapper = document.createElement("div");
      switch (this.config.size) {
          case 'xsmall':
              wrapper.className = "bright xsmall";
              break;
          case 'small':
              wrapper.className = "bright small";
              break;
          case 'medium':
              wrapper.className = "bright medium";
              break;
          case 'large':
              wrapper.className = "bright large";
              break;
          default:
              wrapper.className = "bright medium";
      }
      wrapper.innerHTML = this.jftResult;
    }

    // // Data from helper
    // if (this.dataNotification) {
    // 	var wrapperDataNotification = document.createElement("div");
    // 	// translations  + datanotification
    // 	wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

    // 	wrapper.appendChild(wrapperDataNotification);
    // }
    return wrapper;
  },

  getScripts: function () {
    return [];
  },

  getStyles: function () {
    return ["MMM-JustForTodayMeditation.css"];
  },

  // Load translations files
  getTranslations: function () {
    //FIXME: This can be load a one file javascript definition
    return {
      en: "translations/en.json",
      es: "translations/es.json"
    };
  },

  processData: function (data) {
    var self = this;
    this.dataRequest = data;
    if (this.loaded === false) {
      self.updateDom(self.config.animationSpeed);
    }
    this.loaded = true;

    // the data if load
    // send notification to helper
    this.sendSocketNotification(
      "MMM-JustForTodayMeditation-NOTIFICATION_TEST",
      data
    );
  },

  // socketNotificationReceived from helper
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "JFT_RESULT":
        this.jftResult = payload;
        this.updateDom();

        break;

      case "MMM-JustForTodayMeditation-NOTIFICATION_TEST":
        // set dataNotification
        this.dataNotification = payload;
        this.updateDom();

        break;

      default:
    }
  }
});
