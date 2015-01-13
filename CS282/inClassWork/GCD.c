#include <stdio.h>//standard header file
#include <stdlib.h>//for exit() function

// int gcdFunction(int x, int y);

/* computes the GCD of two positive integers puts the value into the third argument */
void computeGCD(int, int, int *);
int recursiveGCD(int, int);

int main(){
	int x, y, gcd;
	printf("Please enter two positive numbers seperated by a space:  ");
	scanf("%d %d", &x, &y);
	getchar();
	if(x <= 0 || y <= 0){
		printf("Invalid input.\n");
		exit(1);
	}
	else
		computeGCD(x, y, &gcd);
		//gcd = recursiveGCD(x, y);
	printf("The GCD of %d and %d is %d.\n", x, y, gcd);
	return 0;
}

//calculate the GCD - USES EUCLID'S CLASSIC ALGORITHM
// takes two postive integers and returns the gcd of the two integers
/* int gcdFunction(int x, int y){  // gcdFunction IS A BAD NAME
// CALL IT computeGCD
	int temp;
	if(x < y){
		temp = x;
		x = y;
		y = temp;
	}
	while(x != 0){
		temp = x;
		x = y % x;
		y = temp;
	}
	return y;
}  */

/* MATTHEW:
I AGREE THAT YOUR PROGRAM WORKS.  BUT YOUR LOGIC IS UNNECESSARILY COMPLEX.
HERE IS A BETTER WAY TO WRITE IT.
*/
void computeGCD(int m, int n, int *gcd) {
	int temp, r;

	// for the algorithm to work, the integers should be in the
	// non-decreasing order.
	if (m < n) {
		temp = m;
		m = n;
		n = temp;
    }

    r = m % n;
    while (r != 0) {
		m = n;
		n = r;
		r = m % n;
    }
    *gcd = n;
}

int recursiveGCD(int m, int n){
	//for the algorithm to work the integers need to be in increasing order
	int temp, r;
	if(m < n){
		temp = m;
		m = n;
		n = temp;
	}
	r = m % n;
	if(r == 0)
		return(n);
	else
		return(recursiveGCD(n, r));
}
