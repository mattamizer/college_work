#ifndef ASSG7_H
#define ASSG7_H

#include <stdio.h>    /* standard header file */

/* this function uses Sieve of Eratosthenes to compute all the
   primes <= n.  The function stores the prime numbers and the
   count of primes in the parameters
 */
void getPrimes(int num, int **pointer, int *count);   // YOU NEED TO COMPLETE THIS

/* this function takes

   fpout - a file pointer to an output text file
   array - an array of integers (which
           holds the primes numbers in the range 2 <-> n),
   n  -  the number inputted by the user
   count - the number of primes in the range 2 <-> n

   and writes the prime numbers in the array to the output
   text file.  Each line in the output file has at most
   NUMBERS_PER_LINE integers
 */
void writeToOutputFile(FILE *fpout, int array[], int n, int count);

#endif

