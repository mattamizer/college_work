#include <stdio.h>
#define EOLN '\n'
#define SENTINEL '#'
#define TAB '\t'

int main(){
	int ioChar;
	printf("The sentinel charater is %c\n", SENTINEL);
	printf("Enter a line with the sentinel charater and a tab in it.\n\n");
	while((ioChar = getchar()) != EOLN){
		if(ioChar == SENTINEL)
			break;
		if(ioChar == TAB){
			putchar('\\');
			putchar('t');
			continue;
		}
		putchar(ioChar);
	}
	printf("\n");
	return 0;
}
