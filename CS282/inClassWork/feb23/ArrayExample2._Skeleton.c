#include <stdio.h>

/* Arrays.     ArrayExample2.c
   On success, scanf returns the number of input fields successfully scanned,
   converted, and stored. The return value does not include scanned fields that
   were not stored.
   On error: if no fields were stored, scanf returns 0.
   If scanf attempts to read at end-of-file or at end-of-string, it returns EOF
*/

void sort(int *, int);
/* takes an integer array a of count values and sorts them
   in the ascending order */

/* swaps the int values stored in locations 
   pointed to by a and b */
void swap(int *a, int *b);

/* Gets integer values from the standard input, fills the
   array.  The # of values entered is stored in *count */
void fillArray(int *array, int *count);

/* prints the values in array on the screen. count is the
   number of elements to be printed */
void printArray(const int *array, int count);

#define SIZE 20

int main()   {
   int count;
   int array[SIZE];

   fillArray(array, &count);
   printf("\nBefore sorting the elements in the array are:\n");
   printArray(array, count);

   sort(array, count);
   printf("\nAfter sorting the elements in the array are:\n");
   printArray(array, count);

   return 0;
}

/* Gets integer values from the standard input, fills the
   array.  The # of values entered is stored in *count */
void fillArray(int *array, int *count) {
    int returnValue;
    *count = 0;
    do {
	printf("Please enter an integer or press control-D to quit: ");
	returnValue = scanf("%d", array + (*count));
	if (returnValue == EOF) break;
	(*count)++;
    } while (*count < SIZE);
}

void printArray(const int *a, int count) {
   int ii;

   for (ii = 0; ii < count; ii++)
       printf("Contents of location: %2d = %3d\n", ii, *(a + ii) );
}

/* takes an integer array a of count values and sorts them 
   in the increasing order */
void sort(int *a, int count)  {
    int i, j, minIndex;
    for(i = 0; i < count; i++){
        minIndex = i;
        for(j = i + 1; j < count; j++){
          if(*(a+j) < *(a+minIndex))
               minIndex = j;
        }
        swap(a+i, a+minIndex);
    }
}

void swap(int *num1, int *num2)   {
    int temp;

    temp = *num1;
    *num1 = *num2;
    *num2 = temp;
}



/* OUTPUT
aparna@aparna-laptop:~/Documents/CS282$ gcc ArrayExample2.c
aparna@aparna-laptop:~/Documents/CS282$ ./a.out
Please enter an integer or press control-D to quit: 98
Please enter an integer or press control-D to quit: 45
Please enter an integer or press control-D to quit: 4
Please enter an integer or press control-D to quit: 100
Please enter an integer or press control-D to quit: 11
Please enter an integer or press control-D to quit: 2
Please enter an integer or press control-D to quit: 32
Please enter an integer or press control-D to quit: 6
Please enter an integer or press control-D to quit: 
Before sorting the elements in the array are:
Contents of location:  0 =  98
Contents of location:  1 =  45
Contents of location:  2 =   4
Contents of location:  3 = 100
Contents of location:  4 =  11
Contents of location:  5 =   2
Contents of location:  6 =  32
Contents of location:  7 =   6

After sorting the elements in the array are:
Contents of location:  0 =   2
Contents of location:  1 =   4
Contents of location:  2 =   6
Contents of location:  3 =  11
Contents of location:  4 =  32
Contents of location:  5 =  45
Contents of location:  6 =  98
Contents of location:  7 = 100
aparna@aparna-laptop:~/Documents/CS282$ 

*/
