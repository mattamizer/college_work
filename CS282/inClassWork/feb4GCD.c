#include <stdio.h>//standard header file
#include <stdlib.h>//for exit() function

int gcdFunction(int x, int y);
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
		gcd = gcdFunction(x, y);
	printf("The GCD of %d and %d is %d.\n", x, y, gcd);
	return 0;
}

//calculate the GCD
int gcdFunction(int x, int y){
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
}
	
