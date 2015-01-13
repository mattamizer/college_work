# This is the makefile for this assignment

# The first line Assg6: Assg6_Driver.o Assg6_Implementation.o is called
# the dependency line.  It has to start at column 1

# The second line 
# gcc -o Assg6 Assg6_Driver.o Assg6_Implementation.o -lm
# is called the action line. 
# Each action line has to start with a tab
# The action line says how the program is to be compiled if 
# one or more of the .o files have been changed
# A dependency line and an action line together is called a rule

# Linking object files
Assg6:Assg6_Driver.o Assg6_Implementation.o
	gcc -o Assg6 Assg6_Driver.o Assg6_Implementation.o -lm

# Compiling source files
# -c flag tells the compiler just to compile the file and not to link

Assg6_Driver.o:Assg6_Driver.c Assg6.h
	gcc -c Assg6_Driver.c
Assg6_Implementation.o:Assg6_Implementation.c Assg6.h
	gcc -c Assg6_Implementation.c
