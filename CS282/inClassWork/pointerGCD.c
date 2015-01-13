#include <stdio.h>      // standard header file

/* computes the GCD of two positive integers and returns the value
   in *answer.  Uses Euclid's classic algorithm  */

void GCD(int, int, int *answer);

int main(){
    int num1, num2, answer;
    char userResponse;

    do {
		printf("Please enter two positive numbers seperated by a space:  ");
        scanf("%d %d", &num1, &num2);
        getchar();  // flush the input buffer

        if(num1 <= 0 || num2 <= 0)
	        printf("Input should be two positive integers\n");

        else  {
			GCD(num1, num2, &answer);
            printf("The GCD of %d and %d is %d\n", num1, num2,
                 answer);
	    }
        printf("\nWould you like to try again? Press Y for Yes and N for NO: ");
        scanf("%c", &userResponse);

    } while ((userResponse == 'Y') || (userResponse == 'y'));

    printf("Thank you and good bye\n");

    return 0;
}

// takes two postive integers and finds the gcd of the two integers
// GCD is returned in *result
void GCD(int M, int N, int *result) {
    int temp, R;

    // the algorithm expects the inputs in the non-increasing order
    // if the inputs are in the wrong order, swap them first
    if(M < N){
       temp = M;
       M = N;
       N = temp;
    }

    R = M % N;
    if(R == 0)
    	*result = N;
    else
    	GCD(N, R, result);
}
