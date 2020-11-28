# MMM-NatureRemo
Magic Mirror module for displaying sensor data from [Nature Remo](https://en.nature.global/).

![image](https://user-images.githubusercontent.com/48573325/100518374-85a5de80-31d4-11eb-9604-a1e5dd07e329.png)

[Nature Remo](https://en.nature.global/) has a set of sensors and these sensor data can be fetched from [Nature Remo cloud API](https://developer.nature.global/en/overview).
The cloud API is available for anyone who got Nature Remo smart controller by creating access token on the web page.
## Installation

Clone this repository and place it on MagicMirror module directory.
```
$ cd ~/MagicMirror/modules
$ git clone https://github.com/mtatsuma/MMM-NatureRemo.git
```

## Configuration example
```
      - module: MMM-NatureRemo
        position: top_left
        config:
          apiToken: xxxx
          deviceName: remo-1
```

## Configuration options

| Options | Required | Default | Description |
|:--------|:--------:|:--------|:------------|
| updateInterval | | `10 * 60 * 1000` | Weather data update interval (miliseconds). Note: the access rate for [Nature Remo cloud API](https://developer.nature.global/en/overview) is limited as 30 requests per 5 minutes. |
| retryDelay | | `5 * 1000` | Delay for retry to get weather data (miliseconds) |
| title | | `Nature Remo` | Title to display |
| apiBase | | `https://api.nature.global/` | Base URL of [Nature Remo cloud API](https://developer.nature.global/en/overview) |
| apiEndpoint | | `1/devices` | API endpoint to be used for fetching sensor data |
| apiToken | yes | | API access token to call [Nature Remo cloud API](https://developer.nature.global/en/overview). |
| deviceName | | | Device name of the target Nature Remo device. If you don't set both of `deviceName` and `deviceID`, a device on the top of the device list will be selected. |
| deviceID | | | Device ID of the target Nature Remo device. If you don't set both of `deviceName` and `deviceID`, a device on the top of the device list will be selected. |
| height | | `300px` | Height of the display box for this module. |
| width | | `500px` | Width of the display box for this module. |
| showTemperature | | `true` | Show temperature data. |
| showHumidity | | `true` | Show humidity data. |
| showIllumination | | `true` | Show illumination data (Dark, Dim, Medium, Light and sensor data value). |
| showMotion | | `true` | Show motion sensor data (motion detection time). |
| temperatureTitle | | `Temperature: ` | Title for temperature data |
| humidityTitle | | `Humidity: ` | Title for humidity data |
| illuminationTitle | | `Illumination: ` | Title for illumination data |
| motionTitle | | `Motion Detect: ` | Title for motion sensor data. |
| temperatureUnit | | `Celsius` | Unit of temperature. `Celsius` or `Fahrenheit` |
| motionDateOffsetSeconds | | `0` | Time offset (seconds) for motion detection time |
| motionDateHourFormat | | `24h` | If you set `12h`, the time format of motion detection time is changed to 12 hour format |
