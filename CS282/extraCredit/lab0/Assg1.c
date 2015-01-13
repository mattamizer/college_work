#include <stdio.h>

/*
   Name: Aparna Mahadev
   Course: CS 282 Unix Systems Programming
   Semester: Spring 2010
   Assignment: #1
   Description:  In this assignment, we get 3 integer values from the user
                 and print the values in increasing order
   Concepts Used: Function calls, scanf, if-else
   Known Bugs: None
   Time Estimate: 15 Minutes
*/

/* takes three integer values and prints them in increasing order */
void printInOrder(int x, int y, int z);

int main() {
   int num1, num2, num3;

   printf("Please enter three integers separated by a space: ");
   scanf("%d %d %d", &num1, &num2, &num3);

   printf("The values entered are %d, %d and %d\n",
          num1, num2, num3);

   printInOrder(num1, num2, num3);

   printf("Good bye!\n");

   return 0;
}

/* takes three integer values and prints them in increasing order */
void printInOrder(int x, int y, int z) {
   if ((x <= y) && (y <= z))
      printf("The values in the increasing order are %d %d and %d\n", x, y, z);

   else if ( (x <= z) && (z <= y))
       printf("The values in the increasing order are %d %d and %d\n", x, z, y);

   else if ((y <= x) && (x <= z))
       printf("The values in the increasing order are %d %d and %d\n", y, x, z);

   else if ((y <= z) && (z <= x))
       printf("The values in the increasing order are %d %d and %d\n", y, z, x);

   else if ((z <= x) && (x <= y))
       printf("The values in the increasing order are %d %d and %d\n", z, x, y);

   else
       printf("The values in the increasing order are %d %d and %d\n", z, y, x);
}
