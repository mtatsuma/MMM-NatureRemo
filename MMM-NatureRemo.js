/* Magic Mirror
 * Module: MMM-NatureRemo
 *
 * By Tatsuma Matsuki
 * MIT Licensed.
 * Some code is borrowed from 
 * https://github.com/roramirez/MagicMirror-Module-Template
  */

Module.register("MMM-NatureRemo", {
    defaults: {
        updateInterval: 10 * 60 * 1000,
        retryDelay: 5000,
        title: "Nature Remo",
        apiBase: "https://api.nature.global/",
        apiEndpoint: "1/devices",
        apiToken: "",
        deviceName: "",
        deviceID: "",
        height: "300px",
        width: "500px",
        showTemperature: true,
        showHumidity: true,
        showIllumination: true,
        showMotion: true,
        temperatureTitle: "Temperature: ",
        humidityTitle: "Humidity: ",
        illuminationTitle: "Illumination: ",
        motionTitle: "Motion Detect: ",
        temperatureUnit: "Celsius",
        motionDateOffsetSeconds: 0,
        motionDateHourFormat: "24h"
    },

    requiresVersion: "2.12.0",

    start: function () {
        var self = this;
        var dataRequest = null;
        var dataNotification = null;

        //Flag for check if module is loaded
        this.loaded = false;

        // Schedule update timer.
        this.getData();
        setInterval(function () {
            self.updateDom();
        }, this.config.updateInterval);
    },

    /*
     * getData
     * function example return data and show it in the module wrapper
     * get a URL request
     *
     */
    getData: function () {
        const self = this;

        if (this.config.apiToken === "") {
            Log.error(self.name + ": apiToken must be specified");
            return;
        }

        const url = `${this.config.apiBase}${this.config.apiEndpoint}`;
        var retry = true;
        let delay = self.config.retryDelay;

        fetch(url, {
            headers: { "Authorization": `Bearer ${this.config.apiToken}` }
        })
            .then((res) => {
                if (res.status == 401) {
                    retry = false;
                    throw new Error(self.name + ": apiToken is invalid");
                } else if (res.status == 429) {
                    delay = 60 * 1000;
                    throw new Error(self.name + ": too many requests and got 429 status");
                } else if (!res.ok) {
                    throw new Error(self.name + ": failed to get api response");
                }
                return res.json();
            })
            .then((json) => {
                self.processData(json);
            })
            .catch((msg) => {
                Log.error(msg);
            })
            .finally(() => {
                if (retry) {
                    self.scheduleUpdate((self.loaded) ? -1 : delay);
                }
            })
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

    getIllumiString: function (value) {
        if (value <= 50) {
            return `Dark (${value})`;
        } else if (value > 50 && value <= 127) {
            return `Dim (${value})`;
        } else if (value > 127 && value <= 205) {
            return `Medium (${value})`;
        } else {
            return `Light (${value})`;
        }
    },

    getHourString: function (hour, minute) {
        let m = ("0" + minute).slice(-2);
        if (this.config.motionDateHourFormat == "12h") {
            let ampm = hour < 12 ? 'a.m.' : 'p.m.';
            let h = hour % 12;
            h = h ? h : 12;
            h = ("0" + h).slice(-2);
            return `${h}:${m} ${ampm}`;
        } else {
            let h = ("0" + hour).slice(-2);
            return `${h}:${m}`;
        }
    },

    getDevice: function (data) {
        const self = this;
        let devices;
        if (this.config.deviceID !== "") {
            devices = data.filter(function (value) {
                return value.id == self.config.deviceID;
            });
        } else if (this.config.deviceName !== "") {
            devices = data.filter(function (value) {
                return value.name == self.config.deviceName;
            });
        }
        if (devices.length) {
            return devices[0];
        } else {
            return NaN;
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        const title = document.createElement("span");
        title.style.fontSize = "0.5em";
        title.innerHTML = this.config.title;
        wrapper.appendChild(title);
        wrapper.style.width = this.config.width;
        wrapper.style.height = this.config.height;
        wrapper.style.lineHeight = "1em";
        if (this.sensorData) {
            const dev = this.getDevice(this.sensorData);
            if (!dev) {
                const error = document.createElement("div");
                error.innerHTML = "No devices are found";
                wrapper.appendChild(error);
                return wrapper;
            }
            if (this.config.showTemperature) {
                const tempWrapper = document.createElement("div");
                const tempTitle = document.createElement("span");
                const temp = document.createElement("span");
                tempTitle.style.fontSize = "0.8em";
                tempTitle.innerHTML = this.config.temperatureTitle;
                temp.style.color = "#fff";
                if (this.config.temperatureUnit == "Fahrenheit") {
                    temp.innerHTML = `${dev.newest_events.te.val * 1.8 + 32}°F`;
                } else {
                    temp.innerHTML = `${dev.newest_events.te.val}°C`;
                }
                tempWrapper.appendChild(tempTitle);
                tempWrapper.appendChild(temp);
                wrapper.appendChild(tempWrapper);
            }
            if (this.config.showHumidity) {
                const humiWrapper = document.createElement("div");
                const humiTitle = document.createElement("span");
                const humi = document.createElement("span");
                humiTitle.style.fontSize = "0.8em";
                humiTitle.innerHTML = this.config.humidityTitle;
                humi.style.color = "#fff";
                humi.innerHTML = `${dev.newest_events.hu.val}%`;
                humiWrapper.appendChild(humiTitle);
                humiWrapper.appendChild(humi);
                wrapper.appendChild(humiWrapper);
            }
            if (this.config.showIllumination) {
                const illuWrapper = document.createElement("div");
                const illuTitle = document.createElement("span");
                const illu = document.createElement("span");
                illuTitle.style.fontSize = "0.8em";
                illuTitle.innerHTML = this.config.illuminationTitle;
                illu.style.color = "#fff";
                illu.innerHTML = `${this.getIllumiString(dev.newest_events.il.val)}`;
                illuWrapper.appendChild(illuTitle);
                illuWrapper.appendChild(illu);
                wrapper.appendChild(illuWrapper);
            }
            if (this.config.showMotion) {
                const motiWrapper = document.createElement("div");
                const motiTitle = document.createElement("span");
                const moti = document.createElement("span");
                motiTitle.style.fontSize = "0.8em";
                motiTitle.innerHTML = this.config.motionTitle;
                moti.style.color = "#fff";
                let unixTime = Date.parse(dev.newest_events.mo.created_at);
                unixTime = unixTime + this.config.motionDateOffsetSeconds;
                const date = new Date(unixTime);
                const time = this.getHourString(date.getHours(), date.getMinutes());
                moti.innerHTML = `${date.getMonth() + 1}/${date.getDate()} ${time}`;
                motiWrapper.appendChild(motiTitle);
                motiWrapper.appendChild(moti);
                wrapper.appendChild(motiWrapper);
            }
        }

        // Data from helper
        if (this.dataNotification) {
            var wrapperDataNotification = document.createElement("div");
            // translations  + datanotification
            wrapperDataNotification.innerHTML = "Updated at " + this.dataNotification.date;

            wrapper.appendChild(wrapperDataNotification);
        }
        return wrapper;
    },

    getScripts: function () {
        return [];
    },

    getStyles: function () {
        return [];
    },

    getTranslations: function () {
        return false;
    },

    processData: function (data) {
        var self = this;
        this.sensorData = data;
        if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
        this.loaded = true;

        // the data if load
        // send notification to helper
        this.sendSocketNotification("MMM-NatureRemo-NOTIFICATION", data);
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function (notification, payload) {
        if (notification === "MMM-NatureRemo-NOTIFICATION") {
            // set dataNotification
            this.dataNotification = payload;
            this.updateDom();
        }
    },
});
