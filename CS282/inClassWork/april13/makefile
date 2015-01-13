Queue:QueueDriver.o QueueImplementation.o
	gcc -o Queue QueueDriver.o QueueImplementation.o
QueueDriver.o:QueueDriver.c Queue.h
	gcc -c QueueDriver.c
QueueImplementation.o:QueueImplementation.c Queue.h
	gcc -c QueueImplementation.c

