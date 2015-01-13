#include <stdio.h>      // standard header file
#include <stdlib.h>

/* computes the GCD of two positive integers and returns the value.
   uses Euclid's classic algorithm  */

int GCD(int, int);

int main(){
    int num1, num2;
    char userResponse;
    FILE *fpout;
    if((fpout = fopen("output.txt", "w+")) == NULL){
        printf("Output file cannot be opened!\n");
        exit(1);
    }
    do {
		printf("Please enter two positive numbers seperated by a space:  ");
        scanf("%d %d", &num1, &num2);
        getchar();  // flush the input buffer

        if(num1 <= 0 || num2 <= 0)
	        printf("Input should be two positive integers\n");

        else{
            fprintf(fpout, "The GCD of %d and %d is %d\n", num1, num2,
                 GCD(num1, num2));
            printf("Data written to file.\n");
        }

        printf("\nWould you like to try again? Press Y for Yes and N for NO: ");
        scanf("%c", &userResponse);

    } while ((userResponse == 'Y') || (userResponse == 'y'));
    
    fclose(fpout);

    printf("Thank you and good bye\n");

    return 0;
}

// takes two postive integers and returns the gcd of the two integers
int GCD(int M, int N) {
    int temp, R;

    // the algorithm expects the inputs in the non-increasing order
    // if the inputs are in the wrong order, swap them first
    if(M < N){
       temp = M;
       M = N;
       N = temp;
    }

    R = M % N;
    while (R != 0) {
	   M = N;
	   N = R;
	   R = M % N;
    }
    return N;
}
