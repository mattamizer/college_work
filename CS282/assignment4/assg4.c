#include <stdio.h>

/*  
   Name: Matthew Morrissey
   Course: CS 282 Unix Systems Programming Section 02
   Semester: Spring 2010
   Assignment: #4
   Description:  In this assignment, we get 3 integer values from the user
                 and print the values in increasing order
   Concepts Used: Function calls, scanf, if-else
   Known Bugs: None
   Time Estimate: 10 minutes
*/
   
/* takes three integer values and prints them in increasing order */
void sortAscending(int *x, int *y, int *z);
void swap(int *x, int *y);
int main() {
   int num1, num2, num3;
   char repeat;
   do{
   printf("Please enter three integers separated by a space: ");
   scanf("%d %d %d", &num1, &num2, &num3);
   getchar();
   printf("The values entered are %d, %d and %d\n",
          num1, num2, num3);

   sortAscending(&num1, &num2, &num3);
   printf("The values in increasing order are %d, %d, and %d.\n", num1, num2, num3);
   printf("Would you like to try again? (y/n):  ");
   scanf("%c", &repeat);
   }while(repeat == 'Y' || repeat == 'y');

   printf("Good bye!\n");

   return 0;
}
/* takes two integer values and swaps them */
void swap(int *x, int *y){
     int temp;
     temp = *x;
     *x = *y;
     *y = temp;
}
/* takes three integer values and sorts them in increasing order */
void sortAscending(int *x, int *y, int *z) {
    do{
    	    if(*x > *y)
	       swap(x, y);
	    if(*y > *z)
	       swap(y, z);
	    if(*x > *z)
	       swap(x, z);
    }while(!(*x <= *y && *y <= *z));
}
