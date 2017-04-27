import time
import serial

# configure the serial connections (the parameters differs on the device you are connecting to)
ser = serial.Serial(
    port='/dev/cu.wchusbserial1420',
    baudrate=110,
    parity=serial.PARITY_ODD,
    stopbits=serial.STOPBITS_TWO,
    bytesize=serial.SEVENBITS
)

ser.isOpen()

print 'Enter your commands below.\r\nInsert "exit" to leave the application.'

input=1
out=''
while 1 :
        while ser.inWaiting() > 0:
            out += ser.read(1)

        if out != '':
            #print ">>" + out
            print ">>",
            print out
            out=''