#include "Assg6.h"
#include <stdio.h>  // standard header file 

/* Name: Matthew Morrissey 
   E-mail: mmorrissey1@worcester.edu
   Course: CS 282 01 Spring 10
   Assignment #: 6
   Description:  In this assignment, we create a mini-statistics
   package.  The program accepts up to 200 float numbers from the
   user and reports the following:
   mininum
   maximum
   median
   mean
   mode
   standard deviation
   variance

   Concepts used: arrays and pointers, makefile, static storage class,
                  creating an executable from multiple .c files

   Known Bugs: None
   Time Estimate: 16 hours. I was in my estimate, though mode did require
                  the majority of that time.
 */

 int main() {
    float data[SIZE];
    int count = 0;
    int choice;

    printf("Mini-Statitics Package\n");
    printf("----------------------\n");
    do {
		printf("\nThis program will perform the following\n");
		printf("1) Enter data\n");
		printf("2) Display the data and the following statistics: \n");
		printf("   the number of data items, the high and low values in the data,\n");
		printf("   the mean, median, mode, variance and standard deviation.\n");
		printf("3) Quit the program\n");
		printf("\nYour choice? ");
		scanf("%d", &choice);
		getchar();

		switch(choice) {
			case 1: getData(data, &count);
			        break;

			case 2: displayStatistics(data, count);
			        break;

			case 3: printf("Thank you and good bye!\n");
			        break;

			default: printf("%d is not a valid choice\n", choice);
	    }
    } while (choice != 3);

    return 0;
 }
