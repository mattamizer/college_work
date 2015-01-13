# This is the makefile for this example

# The first line 
#     Assg3: Assg3_Driver.o Assg3_Implementation.o 
# is called the dependency line.  It has to start at column 1

# The second line 
#       gcc -o Assg3 Assg3_Driver.o Assg3_Implementation.o
# is called the action line. 

# Each action line has to start with a tab
# The action line says how the program is to be compiled if 
# one or more of the .o files have been changed
# A dependency line and an action line together is called a rule

# Linking object files
Assg3:Assg3_Driver.o Assg3_Implementation.o
	gcc -o Assg3 Assg3_Driver.o Assg3_Implementation.o

# Compiling source files
# -c flag tells the compiler just to compile the file and not to link

Assg3_Driver.o:Assg3_Driver.c Assg3.h
	gcc -c Assg3_Driver.c
Assg3_Implementation.o:Assg3_Implementation.c Assg3.h 
	gcc -c Assg3_Implementation.c
