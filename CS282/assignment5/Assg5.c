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

   Name:  Matthew Morrissey
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 5
   Time Estimate: 2 hours and I was over my estimate
   Known Bugs: None
 */

#define SIZE 10001
#define NUMBERS_PER_LINE 20

#include <stdio.h>    /* for input output functions */
#include <math.h>     /* for the sqrt function */
#include <stdlib.h>   /* for the exit function */

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
           holds the primes numbers in the range 2 <-> 
   n  -  the number inputted by the user
   count - the number of primes in the range 2 <-> n
   and writes the prime numbers in the array to the output
   text file.  Each line in the output file has at most 20 integers
 */
void writeToOutputFile(FILE *fpout, int array[], int n, int count);

int main() {
    char repeat;
    int userNum, i = 0, count;
    FILE *fpOut;
    int primeArray[SIZE];
    if((fpOut = fopen("output.txt", "w+")) == NULL){
        printf("Output file cannot be opened!\n");
        exit(1);
    }
    do{
      count = 0;
      printf("Please enter an integer from 2 <-> 10000 inclusive:  ");
      scanf("%d", &userNum);
      getchar();
      if(userNum < 2 || userNum > 10000){
	printf("Number outside specified range!\n");
	exit(1);
      }
      for(i; i <= userNum; i++)
	*(primeArray + i) = i;
      getPrimes(userNum, primeArray, &count);
      writeToOutputFile(fpOut, primeArray, userNum, count);
      printf("Would you like to use another number?(Y/N):  ");
      scanf("%c", &repeat);
      getchar();
    }while(repeat == 'Y' || repeat == 'y');
    fclose(fpOut);
}  /* main */


/* this function uses Sieve of Eratosthenes to compute all the
   primes <= num.  All the prime numbers in the range
   2 <-> n are stored in the array arrayOfPrimes.  The number of
   prime numbers in the array is stored in the parameter *count
 */
void getPrimes(int num, int *arrayOfPrimes, int *count) {
  *arrayOfPrimes = 0;
  *(arrayOfPrimes + 1) = 0;
  int x = 2, y, i = 0;
  for(x; x < sqrt(num); x++){
    if(*(arrayOfPrimes + x) == 0)
      continue;
    for(y = x + x; y <= num; y += x)
      *(arrayOfPrimes + y) = 0;
  }
  for(i; i <= num; i++)
    if(*(arrayOfPrimes + i) != 0)
      (*count)++;
}

/* this function takes
   fpout - a file pointer to an output text file
   primes - an array of integers (which
           holds the primes numbers in the range 2 <-> n),
   n  -  the number inputted by the user
   count - the number of primes in the range 2 <-> n
   and writes the prime numbers in the array to the output
   text file.  Each line in the output file has at most
   NUMBERS_PER_LINE integers
 */

void writeToOutputFile(FILE *fpOut, int primes[], int n, int count) {
  int i = 0, p = 0, numLine = 0;
  fprintf(fpOut, "There are %d prime numbers less than or equal to %d.\n\n", count, n);
  for(i; i <= n; i++){
    if(*(primes + i) != 0){
       fprintf(fpOut, "%d  ", *(primes + i));
       numLine++;
    }
    if(numLine == NUMBERS_PER_LINE){
       fprintf(fpOut, "\n");
       numLine = 0;
    }
  }
  fprintf(fpOut, "\n\n");
}

/* Sample Run
aparna@aparna-laptop:~/Documents/CS282$ gcc -o Assg5 Assg5.c -lm
aparna@aparna-laptop:~/Documents/CS282$ ./Assg5
Please enter an integer in the range 2 <-> 10000 both inclusive: 29

Do you want to try again? Press Y for Yes and N for No: Y
Please enter an integer in the range 2 <-> 10000 both inclusive: 1000

Do you want to try again? Press Y for Yes and N for No: Y
Please enter an integer in the range 2 <-> 10000 both inclusive: 1500

Do you want to try again? Press Y for Yes and N for No: Y
Please enter an integer in the range 2 <-> 10000 both inclusive: 1500

Do you want to try again? Press Y for Yes and N for No: Y
Please enter an integer in the range 2 <-> 10000 both inclusive: 15000
Your input 15000 is too large.  It has to be less than 10001

Do you want to try again? Press Y for Yes and N for No: N
Good bye.  Have a nice day
aparna@aparna-laptop:~/Documents/CS282$

*/
