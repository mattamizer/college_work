/* Example in dynamic memory allocation */

#include <stdio.h>      /* standard header file */
#include <assert.h>     /* for assert() macro */
#include <string.h>     /* for memcpy() function */

int *getInts(int *itemsRead);
	created array with those numbers and returns the array. The # of items
	entered by the user is returned through the parameter value */

void printDistinctElements(const int *a, int count);
/*  Precondition: a is an int array and count is the number of elements
    PostCondition: the original array is left untouched by this function.
    This function prints all the distinct elements in the array a  */

void sort(int *array, int count);

int main()  {
	int *numArray, itemsRead, ii;

	numArray = getInts(&itemsRead);

	printf("You entered %d integers\n", itemsRead);

	printDistinctElements(numArray, itemsRead);
	printf("The elements originally entered are given below:\n");
		printf("%d ", *(numArray + ii) );
    printf("\n");

	free(numArray);  /* release the memory allocted in function getInts() */
}  /* main() */

int *getInts(int *itemsRead)  {
   Returns a pointer to the data. itemsRead is set by the function to the number
   of items entered by the user.   */

	int numRead = 0;
	int arraySize = 5;
	int *array;
	char buf[arraySize], *p;

	array = (int *) malloc(sizeof(int) * arraySize);
	assert(array != NULL);

	printf("Enter any number of integers in a line separated by a space\n");
	printf("EOF is <CTRL>+D on Unix systems and <CTRL>+Z in Windows.\n\n");
	
	while (fgets(buf, arraySize, stdin) != NULL) {
	     if (numRead == arraySize) { // double the array 
			arraySize *= 2;
			array = (int *) realloc(array, sizeof(int) * arraySize);
			assert(array != NULL);
		}
		*(strchr(buf, '\n') ) = '\0';  /*step on the '\n' */
	     p = strtok(buf, " ,\t");
		array[numRead++] = atoi(p);
		p = strtok(NULL, " ,\t");
	}

     /*
	while (scanf("%d", &inputValue) == 1) {
		if (numRead == arraySize) { // double the array 
			arraySize *= 2;
			array = (int *) realloc(array, sizeof(int) * arraySize);
			assert(array != NULL);
		}
		array[numRead++] = inputValue;
	}*/

	*itemsRead = numRead;
} /* get_ints() */

void printDistinctElements(const int *array, int count)  {
   The original array is left untouched by this function. */

	int *tempArray;
	int ii;

	tempArray = (int *) calloc(sizeof(int) , count);

	memcpy(tempArray, array, sizeof(int)* count);
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

void sort(int *array, int count)  {
Press EOF ON A NEW LINE when done
EOF is Control-D in Unix and Control-Z in Windows

1 10 45 67 89 45 10 89 1 67
13 65 -2 35 87
11 22 33 22 11 19
^D
You entered 21 integers
The distinct elements you entered are:
-2 1 10 11 13 19 22 33 35 45 65 67 87 89
The elements originally entered are given below:
1 10 45 67 89 45 10 89 1 67 13 65 -2 35 87 11 22 33 22 11 19