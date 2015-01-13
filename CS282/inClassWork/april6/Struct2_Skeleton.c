/* Example 2 in Structures.
   In this program, we open a text file of structures and
   fill in an array of structures.  Then we sort the array
   using the name field, and print the information to the
   output file.
 */

#include <stdio.h>      /* standard header file */
#include <stdlib.h>     /* for the exit() and atoi() functions */
#include <string.h>     /* for the strcmp() function */
#include <assert.h>     /* for the assert macro */

#define MAX 512
#define SIZE 30

typedef struct {
	char name[30];
	long ssn;
	char address[40];
	char city[20];
	int age;
}PERSON;

void fillArray(PERSON array[], int * count, FILE *fpin);
/* reads one line at a time from the file pointed to by fp
   and fills in the array employees.  The number of structures
   read are returned in count.
 */

void printArray(PERSON array[], int count, FILE *fpout);
/* prints all the structures from the employees array to the
   file pointed to by fpout.
 */

void sort(PERSON array[], int count);
/* uses selection sort to sort the structures in the array
   employees according to the name field.
 */

int main()  {
	FILE *fpin, *fpout;
	PERSON employees[SIZE];
	int count =0;

	fpin = fopen("Employees.txt", "r");
     assert(fpin != NULL);

	fpout = fopen("Struct2_Output.txt", "w");
	assert(fpout != NULL);

     fillArray(employees, &count, fpin);

	fprintf(fpout, "The original employee records are given below:\n\n");
	printArray(employees, count, fpout);

	fprintf(fpout, "\n\nThe sorted employee records are given below:\n\n");
	sort(employees, count);
     printArray(employees, count, fpout);

	fclose(fpin);
	fclose(fpout);

	return 0;
}

void fillArray(PERSON *array, int *count, FILE *fp)  {
/* reads one structure at a time from the file pointed to by fp
   and fills in the array employees.  The number of structures
   read are returned in count.
 */
	char buffer[MAX];
	int index = 0;
	while(fgets(buffer, MAX, fp)){
	     buffer[15] = buffer[26] = buffer[54] = buffer[70] = '\0';
	     strcpy(array[index].name, buffer);
	     array[index].ssn = atol(buffer + 16);
	     strcpy(array[index].address, buffer + 27);
	     strcpy(array[index].city, buffer + 55);
	     array[index].age = atoi(buffer + 71);
	     index++;
	}
	*count = index;
}

void printArray(PERSON *employees, int count, FILE *fpout) {
/* prints all the structures from the employees array to the
   file pointed to by fpout.
 */
	int ii;

	for(ii = 0; ii < count; ii++){
		fprintf(fpout, "%12s %6ld    %28s %16s %3d\n" ,
			employees[ii].name, employees[ii].ssn, employees[ii].address, employees[ii].city, employees[ii].age);
     }
}

// Modify the following sort function that sorts an array
// of integers to a sort function that sorts an array of
// PERSON structures
void sort(PERSON *array, int count)  {
    int ii, jj, min_index;
    PERSON temp;

    for (ii = 0; ii < count; ii++) {
	    min_index = ii;
	    for (jj = ii + 1; jj < count; jj++) {
	       if (strcmp(array[jj].name, array[min_index].name) < 0)
		       min_index = jj;
	    }

	    /* now swap the values at locations ii and min_index */
	    temp = array[min_index];
	    array[min_index] = array[ii];
	    array[ii] = temp;
    }
}
