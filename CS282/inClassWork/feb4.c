#include <stdio.h>//standard header file

void computeMaxMin(int num1, int num2, int *max, int *min);
int main(){
	int num1, num2, min, max;
	printf("Please enter two integers seperated by a space:  ");
	scanf("%d %d", &num1, &num2);
	computeMaxMin(num1, num2, &max, &min);
	printf("Maximum of %d and %d is %d.\n", num1, num2, max);
	printf("Minimum of %d and %d is %d.\n", num1, num2, min);
	return 0;
}

//Compute the max and min values of the given numbers
void computeMaxMin(int num1, int num2, int *max, int *min){
	if(num1 > num2){
		*max = num1;
		*min = num2;
	}
	else{
		*max = num2;
		*min = num1;
	}
}
