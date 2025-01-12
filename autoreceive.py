from datetime import datetime
from datetime import timedelta
from time import sleep

import RPi.GPIO as GPIO

RECEIVE_PIN = 27

RECIEVED = []

GPIO.setmode(GPIO.BCM)
GPIO.setup(RECEIVE_PIN, GPIO.IN)

lastTime = datetime.now()
last = 0
max = 800000
cnt = 0

while True:
    cnt = cnt + 1
#    if cnt > max :
#        break
    current = GPIO.input(RECEIVE_PIN)
    currentTime = datetime.now()

    if(current == last):
        if (currentTime - lastTime > timedelta(milliseconds=110)):
            break
        continue

    delta = (currentTime - lastTime).microseconds

    RECIEVED.append((delta, current))

    lastTime = currentTime
    last = current

print("DONE")

print("WRITING TO FILE")

file = open("output", "a")

for i in RECIEVED:
    file.write(str(i[0]) + '\n')

GPIO.cleanup()
