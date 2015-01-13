/* The Sieve of Eratosthenes is a method used to determine all primes
   <= a given number N.  It is very fast.  Initially, we write
   down all the integers from 2 to N.  Begin P at 2.  Cross out all
   multiples of P starting at 2*P; this is easily done by crossing out
   every Pth entry.  Then increment P to the next non-crossed-out
   integer.  Again, cross out all multiples of P.  Repeat these steps
   until P is greater than the square root of N.  The numbers that have
   not been crossed out represent all of the prime numbers smaller than
   or equal to N.  Write a program that implements the Sieve for
   any integer <= 10000

   Name:  Aparna Mahadev
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 5
   Time Estimate: 40 minutes and I was within my estimate
   Known Bugs: None
 */

#define SIZE 10001
#define NUMBERS_PER_LINE 20

#include <stdio.h>    /* for input output functions */
#include <math.h>     /* for the sqrt function */
#include <stdlib.h>   /* fot the exit function */

/* this function uses Sieve of Eratosthenes to compute all the
   primes <= n.  The function finds all the prime numbers
   in the range 2 <-> n and stores them in the array arrayOfPrimes.
   The number of prime numbers in the array is stored in the
   parameter *count
 */
void getPrimes(int n, int *arrayOfPrimes, int *count);

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

int main() {
    int primes[SIZE];
    FILE *fpout;
    int count;
    int userNum;
    char userResponse;

    if ((fpout = fopen("Assg5_Output.txt", "w")) == NULL) {
        printf("Output text file cannot be opened\n");
		exit(1);
    }

    do {
	printf("Please enter an integer in the range 2 <-> %d both inclusive: ", SIZE-1);
        scanf("%d", &userNum);
        getchar();   // flush the input buffer

        if (userNum >= SIZE - 1)
           printf("Your input %d is too large.  It has to be less than %d\n",
               userNum, SIZE);
        else if (userNum < 2)
           printf("Your input %d is too small.  It has to be at least 2\n",
               userNum);

        else {
            getPrimes(userNum, primes, &count);
            writeToOutputFile(fpout, primes, userNum, count);
        }
        printf("\nDo you want to try again? Press Y for Yes and N for No: ");
        scanf("%c", &userResponse);
    } while ((userResponse == 'Y') || (userResponse == 'y'));

    printf("Good bye.  Have a nice day\n");
    fclose(fpout);
    return 0;
}  /* main */


/* this function uses Sieve of Eratosthenes to compute all the
   primes <= num.  All the prime numbers in the range
   2 <-> n are stored in the array arrayOfPrimes.  The number of
   prime numbers in the array is stored in the parameter *count
 */
void getPrimes(int num, int *arrayOfPrimes, int * count) {
	int P, i, counter;
	int last = (int)sqrt(num);

    // initialize the array primes
    for (i = 2; i <= num; i++)
        arrayOfPrimes[i] = i;

    P = 2;
    while (P <= last) {
        counter = 2 * P;
        // mark all multiples of P as non-prime by putting -1
        // in their respective locations
        while (counter <= num) {
            arrayOfPrimes[counter] = -1;
            counter += P;
        }
        // now that all multiples of P are marked non-prime,
        // find the next unmarked number (prime number) after P
        for (i = P+1; i <= last; i++)
            if (arrayOfPrimes[i] != -1) break;
        P = i;
    }

    *count = 0;
    // walk through the array primes to get a count of the prime numbers
    for (i = 2; i <= num; i++)
       if (arrayOfPrimes[i] != -1)
           (*count)++;
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
    for (i = 2; i <= num; i++)  {
	    if (primes[i] != -1) {
	        fprintf(fpout, "%d  ", primes[i]);
	        counter++;
	    }
	    if (counter == NUMBERS_PER_LINE) {
			fprintf(fpout, "\n");
			counter = 0;
	    }
    }
}
