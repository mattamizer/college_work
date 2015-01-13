#include <stdio.h>//standard header file

void swap(int *x, int *y);
int findSum(int x, int y, int *sum);
int main(){
	int x, yn sum;
	printf("Please enter two integers seperated by a space:  ");
	scanf("%d %d", &x, &y);
	getchar();//flush the buffer
	printf("The two values you entered are %d and %d.\n", x, y);
	findSum(x, y, &sum);
	printf("The sum of the two values is %d.\n", sum);
	swap(&x, &y);
	printf("After swapping the two values are now %d and %d.\n", x, y);
	printf("Value of *&x = %d and *&y = %d.\n", *&x, *&y);
	//printf("Value of &*x = %d and &*y = %d.\n", &*x, &*y); this is an invalid statement
	return 0;
}

//Swap function
//Swaps two integer values x and y
void swap(int *x, int *y){
	int temp;
	temp = *x;
	*x = *y;
	*y = temp;
}
//Sum function
//Finds the sum of two integers 
int findSum(int x, int y, int *sum){
	*sum = x + y;
}
