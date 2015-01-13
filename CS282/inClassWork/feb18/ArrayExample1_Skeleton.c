#include <stdio.h>

/* Arrays.     ArrayExample1.c
   On success, scanf returns the number of input fields successfully scanned,
   converted, and stored. The return value does not include scanned fields that
   were not stored.
   On error: if no fields were stored, scanf returns 0.
   If scanf attempts to read at end-of-file or at end-of-string, it returns EOF
*/

/* Gets integer values from the standard input, fills the
   array.  The # of values entered is returned through the
   parameter count */
void fillArray(int*, int*);

/* prints the values in array on the screen. count is the
   number of elements to be printed */
void printArray(const int*, int);

#define SIZE 20

int main()   {
   int count;
   int array[SIZE];

   printf("size of the array is %d\n", sizeof(array));

   fillArray(array, &count);

   printf("\n%d values have been entered\n", count);

   printArray(array, count);

   return 0;
}


/* Gets integer values from the standard input, fills the
   array.  The # of values entered is stored in *count */
void fillArray(int *array, int *count) {
    int scanfValue;
    *count = 0;
    do{
        printf("Please enter an integer or press CTRL+D to quit:  ");
        scanfValue = scanf("%d", (array+*count));
        if(scanfValue == EOF)
          break;
        (*count)++;
    }while(*count < SIZE);
}

void printArray(const int *a, int count) {
   int i;
   printf("Size of a is %d\n", sizeof(a));
   for(i = 0; i < count; i++)
     printf("Contents of array location %d: %d\n", i, *(a+i));
}

/*  
aparna@aparna-laptop:~/Documents/CS282$ gcc ArrayExample1.c
aparna@aparna-laptop:~/Documents/CS282$ ./a.out
size of the array is 80
Please enter an integer or press control-D to quit: 11
Please enter an integer or press control-D to quit: 90
Please enter an integer or press control-D to quit: 2
Please enter an integer or press control-D to quit: 45
Please enter an integer or press control-D to quit: 23
Please enter an integer or press control-D to quit: 
5 values have been entered
Size of a is 4
Contents of location:  0 =  11
Contents of location:  1 =  90
Contents of location:  2 =   2
Contents of location:  3 =  45
Contents of location:  4 =  23
aparna@aparna-laptop:~/Documents/CS282$ 
*/
