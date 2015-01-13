#include <stdio.h>
#include "Assg3.h"

int main(void) {
   extern int height, length;
   register int i;
   
   printf("Address of length is %p\n", &length);
   printf("Address of height is %p\n", &height);

   printf("Please enter an integer for the height of the box: ");
   scanf("%d", &height);
   
   printf("Please enter an integer for the length of the box: ");
   scanf("%d", &length);
   
   writePattern('/', '*', ' ', '*', '/',
                1, length-2, 0, 0, 1, length);
   for(i = 1; i <= height-2; i++)
        writePattern('/', '*', ' ', '*', '/', 
                    1, 1, length-4, 1, 1, length);
   writePattern('/', '*', ' ', '*', '/',
                1, length-2, 0, 0, 1, length);
   //printf("The address of i is %p\n", &i);
   //writeCharFixCount('*', &length, &height);
   return 0;
}
