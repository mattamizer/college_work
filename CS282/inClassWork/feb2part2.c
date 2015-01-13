#include <stdio.h>//standard header file

void getValues(int* x, int* y);
void printValues(int x, int y);

int main(){
	int x, y;
	getValues(&x, &y);
	printValues(x, y);
	return 0;
}

//Get values from the user
void getValues(int *x, int *y){
	printf("Please enter two integers seperated by a space:  ");
	scanf("%d %d", x, y);
	getchar();//flush the buffer
}

//Print two integer values
void printValues(int x, int y){
	printf("The values you entered were %d and %d.\n", x, y);
}
