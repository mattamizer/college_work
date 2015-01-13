#include "Assg8.h"
#include <stdio.h>   /* standard header file  */
#include <assert.h>  /* for the assert macro */

#define SIZE 25

int main() {
   FILE *fpin1, *fpin2, *fpout;
   PERSON *array[SIZE];
   int count = 0 ;

   fpin1 = fopen("Assg8_Input.txt", "r");
   assert(fpin1 != NULL);

   fpin2 = fopen("DOB.txt", "r");
   assert(fpin2 != NULL);

   fpout = fopen("Assg8_Output.txt", "w");
   assert(fpout != NULL);

   fillArray(array, &count, fpin1, fpin2);

   sort(array, count);

   writeToOutputFile(array, count, fpout);

   freeMemory(array, count);

   fclose(fpin1);
   fclose(fpin2);
   fclose(fpout);

   return 0;
}




