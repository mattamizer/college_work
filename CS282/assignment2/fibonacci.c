/*  
   Name: Matthew Morrissey
   Course: CS 282 Unix Systems Programming Section 02
   Semester: Spring 2010
   Assignment: #2
   Description:  In this assignment, we get an integer in the range
                 0 - 35 and compute that place in the Fibonacci
                 sequence.
   Concepts Used: Function calls, scanf, if-else
   Known Bugs: None
   Time Estimate: 10 minutes
*/
#include <stdio.h>

int fibonacci(int n);

int main(){
	int n;
	char answer;
	printf("This program computes the Nth number in the Fibonacci sequence\n");
	printf("where N is the number entered by the user.\n\n");
	do{
		printf("Please enter a number between 0 - 35 inclusive:  ");
		scanf("%d", &n);
		getchar();
		if(n >= 0 && n <= 35)
			printf("The %dth number in the Fibonacci sequence is %d.\n", n, fibonacci(n));
		else{
			printf("Invalid input.\n");
			break;
		}
		printf("Would you like to try again? (y/n):  ");
		scanf("%c", &answer);
		getchar();
	}while(!(answer == 'N' || answer == 'n'));
	printf("Goodbye!\n");
}

//Compute the nth Fibonacci number
int fibonacci(int n){
	/*if(n == 0)
		return 0;
	if(n == 1)
		return 1;
	return (fibonacci(n-1) + fibonacci(n-2));*/
	int n1, n2, fibNum, i;
	n1 = 1;
	n2 = 0;
	fibNum = 0;
	if(n == 0 || n == 1)
		return n;
	for(i = 2; i <= n; i++){
		fibNum = n1 + n2;
		n2 = n1;
		n1 = fibNum;
	}
	return fibNum;
}
