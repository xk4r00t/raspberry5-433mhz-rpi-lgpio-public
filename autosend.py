from datetime import datetime
from datetime import timedelta
from time import sleep
import sys
import RPi.GPIO as GPIO

TRANSMIT_PIN = 17

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRANSMIT_PIN, GPIO.OUT)

print("replaying...")

print(sys.argv)

file = open(sys.argv[1])

current = 1

for i in file:
    sleep(int(i) * 0.000001)
    GPIO.output(TRANSMIT_PIN, current)

    current = (current + 1) % 2

GPIO.cleanup()
