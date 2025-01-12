# raspberry5-433mhz-rpi-lgpio-public
A easy to setup 433Mhz Raspberry 5 Project with FS1000A device



## Installation

```
sudo apt install  python3-rpi-lgpio

```

## Usage

Auto create an 'output' file with an automatic detection of radio message :
```
python3 autoreceive.py
```

After detection and output file is created replay it :
```
python3 autosend.py output
```





## Bonus

### Use RF code with local network

```
node node-query-handler/index.js
#open http://localhost:37123/
```

### Use RF code with internet (see)

```
node node-query-handler-airtable/index.js
```

### Full Rasp context installation with monit
```
ssh pi@192.168.x.x
#pass is raspberry by default

apt install python3-full
apt install python3-venv
apt install monit
apt install nodejs

```


### Monit

Copy file in monit folder in your system monit config directory

```
sudo cp monit/node-svc.conf /etc/monit/conf.d/node-svc.conf

sudo service monit restart
```


## Links

https://www.instructables.com/Super-Simple-Raspberry-Pi-433MHz-Home-Automation/

https://magpi.raspberrypi.com/articles/build-433mhz-radio-chat-device

https://github.com/milaq/rpi-rf

https://github.com/mrpjevans/rfchat.git

https://rpi-lgpio.readthedocs.io/en/release-0.5/install.html



