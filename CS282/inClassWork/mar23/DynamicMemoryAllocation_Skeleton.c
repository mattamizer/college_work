/* Example in dynamic memory allocation */

#include <stdio.h>      /* standard header file */#include <stdlib.h>     /* for dynamic memory allocation functions */
#include <assert.h>     /* for assert() macro */
#include <string.h>     /* for memcpy() function */

int *get_ints(int *itemsRead);/*  gets an unlimited # of integers from the user, fills up a dynamically
	created array with those numbers and returns the array. The # of items
	entered by the user is returned through the parameter value */
void printNonDuplicates(const int *, int count);
/*  Precondition: a is an int array and count is the number of elements
    PostCondition: the original array is left untouched by this function. */

void sort(int *array, int count);/* sorts the elements in the increasing order */

int main()  {
	int *numArray, itemsRead, ii;

     numArray = get_ints(&itemsRead);

	printf("You entered %d integers\n", itemsRead);

	printNonDuplicates(numArray, itemsRead);
	printf("The elements originally entered are given below:\n");	for (ii = 0; ii < itemsRead; ii++)
		printf("%d ", *(numArray + ii) );
     printf("\n");

	free(numArray);  /* release the memory allocted in function getInts() */	return 0;
}  /* main() */
int *get_ints(int *itemsRead){/* Reads an unlimited number of integers, with no attempts at error recovery.
   Returns a pointer to the data. itemsRead is set by the function to the number
   of items entered by the user.   */
   int size = 5, *array, numRead = 0, items;
   
   array = (int *)malloc(size * sizeof(int));
   assert(array != NULL);
   printf("Enter integers seperated by a space.\n");
   printf("On a seperate line press <CTRL>+D when done.\n");
   
   while(scanf("%d", &items) == 1){
     if(numRead == size){
          size *= 2;
          array = (int *)realloc(array, size * sizeof(int));
     }
     assert(array != NULL);
     array[numRead++] = items;
   }
   *itemsRead = numRead;
   
   return (int *)realloc(array, numRead * sizeof(int));
} /* get_ints() */

void printNonDuplicates(const int *array, int count)  {/* Prints the distinct elements in the array
   The original array is left untouched by this function. */
     
     int *tempArray;	int ii;

	tempArray = (int *) calloc(sizeof(int) , count);
	assert(tempArray != NULL);

	memcpy(tempArray, array, sizeof(int)* count);
	/* void *memcpy(void *dest, const void *src, size_t n);
	   Description:
	   Copies a block of n bytes.
	   memcpy is available on UNIX system V systems.
	   memcpy copies a block of n bytes from src to dest.
	   If src and dest overlap, the behavior of memcpy is undefined.
	*/
	sort(tempArray, count);

	printf("The distinct elements you entered are:\n");
	printf("%d ", tempArray[0]);
	for (ii = 1; ii < count; ii++)  {
		if (tempArray[ii] != tempArray[ii-1])
			 printf("%d ", tempArray[ii]);
	}

	printf("\n");

	free(tempArray);  /*free the memory allocated. Don't forget! */
} /* printNonDuplicates() */

void sort(int *array, int count)  {/* sorts the elements in array.  count is the number of elements   in the array */	int ii, jj, minIndex, temp;	for (ii = 0; ii < count; ii++) {		minIndex = ii;		for (jj = ii+1; jj < count; jj++)			if (array[jj] < array[minIndex]) minIndex = jj;		/* now swap the elements at indices minIndex and ii */		temp = array[minIndex];		array[minIndex] = array[ii];		array[ii] = temp;	}}  /* sort() *//* OUTPUT:Enter any number of integers in a line separated by a spacePress EOF when done
1 10 45 67 89 45 10 89 1 67 13 65 -2 35 87 11 22 33 22 11 19 ^D
You entered 21 integers
The non-duplicate elements entered are:
-2 1 10 11 13 19 22 33 35 45 65 67 87 89
The elements originally entered are given below:
1 10 45 67 89 45 10 89 1 67 13 65 -2 35 87 11 22 33 22 11 19*/
