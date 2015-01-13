/*
   Name:  Matthew Morrissey
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 5
   Time Estimate: 20 minutes and I was within my estimate
   Known Bugs: None
 */



#include "Assg8.h"
#include <stdlib.h> //for atoi() function
#include <stdio.h> //standard header file
#include <string.h> //for strcmp() function
#include <assert.h> //for assert() function

#define MAX 512

/* reads one line at a time from the input files, and fills in the struct fields.
   The number of elements in the array is returned in *count
 */
void fillArray(PERSON *array[], int * count, FILE *fpin1, FILE *fpin2){
  char buffer[MAX], buffer2[MAX];
  char *getDateData;
  int index = 0;
  while(fgets(buffer, MAX, fpin1)){
    //Allocate memory for PERSON and all associated members for each array location
    array[index] = (PERSON *)malloc(sizeof(PERSON));
    assert(array[index]);

    array[index] -> dateOfBirth = (DATE *)malloc(sizeof(DATE));
    assert(array[index] -> dateOfBirth);

    array[index] -> lastName = (char *)malloc(strlen(buffer + 1));
    assert(array[index] -> lastName);

    array[index] -> streetAddress = (char *)malloc(strlen((buffer + 27)+1));
    assert(array[index] -> streetAddress);

    array[index] -> city = (char *)malloc(strlen((buffer + 55)+1));
    assert(array[index] -> city);
    
    buffer[15] = buffer[26] = buffer[54] = buffer[70] = '\0';

    //Add data to each PERSON and associated members
    strcpy(array[index] -> lastName, buffer);
    array[index] -> SSN = atol(buffer + 16);
    strcpy(array[index] -> streetAddress, buffer + 27);
    strcpy(array[index] -> city, buffer + 55);
    array[index] -> age = atoi(buffer + 71);
    fgets(buffer2, MAX, fpin2);
    getDateData = strtok(buffer2, "\t");
    array[index] -> dateOfBirth -> month = atoi(getDateData);
    getDateData = strtok(NULL, "\t");
    array[index] -> dateOfBirth -> day = atoi(getDateData);
    getDateData = strtok(NULL, "\n");
    array[index] -> dateOfBirth -> year = atoi(getDateData);
    index++;
  }
  *count = index;
}

/* Sorts the array of struct pointers according to the lastName field */
void sort(PERSON *array[],int count){
  int i, j, min_index;
    PERSON *temp;

    for (i = 0; i < count; i++) {
      min_index = i;
      for (j = i + 1; j < count; j++) {
	if (strcmp(array[j] -> lastName, array[min_index] -> lastName) < 0)
	  min_index = j;
      }

      /* now swap the values at locations ii and min_index */
      temp = array[min_index];
      array[min_index] = array[i];
      array[i] = temp;
    }
}

/* Writes the elements of the array to the output file */
void writeToOutputFile(PERSON *array[], int count, FILE *fpout){
  int i;

  for(i = 0; i < count; i++){
    fprintf(fpout, "%12s %6d    %28s %16s %3d\n" ,
	    array[i] -> lastName, array[i] -> SSN, array[i] -> streetAddress, array[i] -> city, array[i] -> age);
    fprintf(fpout, "Date of birth: %d/%d/%d\n\n", array[i] -> dateOfBirth -> month, array[i] -> dateOfBirth -> day,
	    array[i] -> dateOfBirth -> year);
  }
}

/* frees all the memory allocated to various fields in the structure
   and the structure itself */
void freeMemory(PERSON *array[], int count){
  int i;

  for(i = 0; i < count; i++){
    free(array[i] -> city);
    free(array[i] -> streetAddress);
    free(array[i] -> lastName);
    free(array[i] -> dateOfBirth);
    free(array[i]);
  }
}
