/*  Name: Aparna Mahadev
    Course: Systems Programming
    Semester: Spring 10
    Email:  Aparna.Mahadev@worcester.edu
    Description:  In this assignment we open two text files where in the first file
                  each line corresponds to a person and in the second file, each line
                  corresponds to the date of birth of the same person.
                  We read each line and store it into an array of struct pointers.  We sort the array
                  according to the name field.  The sorted array is written back to an output file
    Known Bugs: None
    Time Estimate: 1 Hour
*/

#ifndef ASSG8_H
#define ASSG8_H

#include <stdio.h>

typedef struct {
   int month;
   int day;
   int year;
} DATE;

typedef struct {
    char *lastName;
    DATE *dateOfBirth;
    int SSN;
    char *streetAddress;
    char *city;
    int age;
} PERSON;

/* reads one line at a time from the input files, and fills in the struct fields.
   The number of elements in the array is returned in *count
 */
void fillArray(PERSON *array[], int * count, FILE *fpin1, FILE *fpin2);

/* Sorts the array of struct pointers according to the lastName field */
void sort(PERSON *array[],int count);

/* Writes the elements of the array to the output file */
void writeToOutputFile(PERSON *array[], int count, FILE *fpout);

/* frees all the memory allocated to various fields in the structure
   and the structure itself */
void freeMemory(PERSON *array[], int count);

#endif

