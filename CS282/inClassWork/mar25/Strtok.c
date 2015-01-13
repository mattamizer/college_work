#include <stdio.h>		/* standard header file */
#include <string.h>		/* for string functions */
#include <stdlib.h>		/* for atoi() function */

#define MAX 80
#define SIZE 40

int main()   {
	char buf[MAX], *p;

	int numbers[SIZE], index = 0, ii;

	printf("Please enter your name: ");
	fgets(buf, MAX, stdin);
	printf("Hello %s Please enter a sequnece of integers\n", buf);
	printf("separated by a space or comma or tab\n");
	fgets(buf, MAX, stdin);

	*(strchr(buf, '\n') ) = '\0';  /*step on the '\n' */

	p = strtok(buf, " ,\t");
	while (p != NULL) {
		numbers[index++] = atoi(p);
		p = strtok(NULL, " ,\t");
	}

	printf("You have entered %d numbers\n", index);
	for (ii = 0; ii < index; ii++)
		printf("%d ", *(numbers + ii));
	printf("\n");

	printf("Now buf is %s\n", buf);
	/*just to show you that strtok changes buf */

	return 0;
}

/* OUTPUT:
Please enter your name: John Doe
Hello John Doe Please enter a sequnece of integers
separated by a space or comma or tab
20		12,34,3,   24,   56 4 50 ,78
You have entered 9 numbers
20 12 34 3 24 56 4 50 78
Now buf is 20

Please enter your name: John Doe
Hello John Doe Please enter a sequnece of integers
separated by a space or comma or tab

You have entered 0 numbers

Now buf is
*/
