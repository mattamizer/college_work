#include "Assg7.h"

#include <stdio.h>  // standard header file
#include <assert.h> // for the assert macro
#include <stdlib.h> // for the free function

#define SIZE 10001

int main() {
    int *primes;
    FILE *fpout;
    int count;
    int userNum;
    char userResponse;

    fpout = fopen("Assg7_Output.txt", "w");
    assert(fpout != NULL);

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
	       getPrimes(userNum, &primes, &count);   // YOU NEED TO COMPLETE THIS
            writeToOutputFile(fpout, primes, userNum, count);
        }
        printf("\nDo you want to try again? Press Y for Yes and N for No: ");
        scanf("%c", &userResponse);
    } while ((userResponse == 'Y') || (userResponse == 'y'));

    printf("Good bye.  Have a nice day\n");

    fclose(fpout);
    free(primes);

    return 0;
}  /* main */

/*
Please enter an integer in the range 2 <-> 10000 both inclusive: 19

Do you want to try again? Press Y for Yes and N for No: y
Please enter an integer in the range 2 <-> 10000 both inclusive: 20000
Your input 20000 is too large.  It has to be less than 10001

Do you want to try again? Press Y for Yes and N for No: y
Please enter an integer in the range 2 <-> 10000 both inclusive: 500

Do you want to try again? Press Y for Yes and N for No: y
Please enter an integer in the range 2 <-> 10000 both inclusive: 0
Your input 0 is too small.  It has to be at least 2

Do you want to try again? Press Y for Yes and N for No: y
Please enter an integer in the range 2 <-> 10000 both inclusive: 1500

Do you want to try again? Press Y for Yes and N for No: n
Good bye.  Have a nice day
*/

