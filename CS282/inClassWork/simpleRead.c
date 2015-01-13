#include <stdio.h>

int main(){
	int x, y;
	char repeat;
	do{
		printf("Please enter two integers seperated by a space: ");
		scanf("%d %d", &x, &y);
		getchar();//Flushes input buffer
		printf("The values you entered were %d and %d and their sum is %d\n", x, y, x+y);
		printf("Do you wish to continue? (y/n): ");
		scanf("%c", &repeat);
	}while(repeat == 'y' || repeat == 'Y');
	printf("Goodbye!\n");
	return 0;
}
