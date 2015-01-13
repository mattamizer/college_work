#include "Assg7.h"

#define NUMBERS_PER_LINE 20

#include <stdio.h>    /* standard header file */
#include <math.h>     /* for the sqrt function */
#include <stdlib.h>   /* for the memory allocation functions */
#include <assert.h>   /* for the assert macro */
#include <string.h>   /* for memcpy() */

/* this function uses Sieve of Eratosthenes to compute all the
   primes <= num.  All the prime numbers in the range
   2 <-> n and the count of the prime numbers in the range 2 <-> n
   are stored in the parameter.
 */
void getPrimes(int num, int **pointer, int *count) {
  int P, i, counter, primeLoc;
    int *tempArray;
    int last = (int)sqrt(num);
    int array[num+1];
    

    // initialize the array primes
    for (i = 2; i <= num; i++)
        array[i] = i;

    P = 2;
    while (P <= last) {
        counter = 2 * P;
        // mark all multiples of P as non-prime by putting -1
        // in their respective locations
        while (counter <= num) {
            array[counter] = -1;
            counter += P;
        }
        // now that all multiples of P are marked non-prime,
        // find the next unmarked number (prime number) after P
        for (i = P+1; i <= last; i++)
            if (array[i] != -1) break;
        P = i;
    }
    
    *count = 0;
    // walk through the array primes to get a count of the prime numbers
    for (i = 2; i <= num; i++)
       if (array[i] != -1)
           (*count)++;

    tempArray = (int *)malloc(sizeof(int) * (*(count-1)));
    assert(tempArray != NULL);

    //add all prime numbers to tempArray
    primeLoc = 0;
    for(i = 2; i <= num; i++)
      if(array[i] != -1)
	tempArray[primeLoc++] = array[i];
     
    *pointer = tempArray;
}

/* this function takes

   fpout - a file pointer to an output text file
   primes - an array of integers (which
           holds the primes numbers in the range 2 <-> n),
   num  -  the number inputted by the user
   count - the number of primes in the range 2 <-> n

   and writes the prime numbers in the array to the output
   text file.  Each line in the output file has at most 20 integers
 */
void writeToOutputFile(FILE *fpout, int primes[], int num, int count) {
    int i;
    int counter = 0;

    fprintf(fpout, "\n\nThere are %d prime numbers less than or equal to %d\n\n",
	    count, num);
    // print all the prime numbers to the output file
    for (i = 0; i < count; i++)  {
	fprintf(fpout, "%d  ", primes[i]);
	counter++;

	if (counter == NUMBERS_PER_LINE) {
	    fprintf(fpout, "\n");
	    counter = 0;
	}
    }
}

