#include <stdio.h>  /* standard header file */
#include<stdlib.h> //for exit() function
/* Name:  Matthew Morrissey
   E-mail: mmorrissey1@worcester.edu
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 3 Part 2
   Description:  In this assignment, we use the code
       provided by the instructor and write code to draw various
       shapes on the screen.

   Concepts used: loops.

   Known Bugs: None
   
   Time Estimate: 5 minutes
 */

void writePattern(char, char, char, char, char,
                   int,  int,  int,  int,  int,  int);
/* writes a line consisting of n1 copies of c1, n2 copies of c2, n3
   copies of c3, n4 copies of c5 and n5 copies of c5 - but the total
   length of the line is not to exceed length.  If more than length
   characters have been requested, writePattern silently truncates
   the line.
 
   counts down from ni and length as it writes characters, taking
   advantage of the fact that these are copies of the original values
   and hence can be changed freely without affecting their values
   in the calling program.
 */

void writeCharFixCount(char, int *, int *);
/* writes one copy of character c and decrements count1 and count2 */

//#define LENGTH 60
//#define HEIGHT 5
#define BLANK ' '
#define MARK '*'
#define EDGE '/'

int main() {
   int HEIGHT, LENGTH;
   printf("Enter two positive integers for the height and width of a box\n");
   printf("using a space to seperate the two numbers(height width):  ");
   scanf("%d %d", &HEIGHT, &LENGTH);
   getchar();
   if(HEIGHT <= 0 || LENGTH <= 0){
   	printf("Invalid input!\n");
   	exit(1);
   }
   int i = 0;
   for(; i < HEIGHT; i++){
   	if(i == 0 || i == (HEIGHT-1))
   		writePattern(EDGE, MARK, BLANK, BLANK, EDGE, 1, LENGTH-2, 0, 0, 1, LENGTH);
   	else
   		writePattern(EDGE, MARK, BLANK, MARK, EDGE, 1, 1, LENGTH-4, 1, 1, LENGTH);
   }
   return 0;
}

void writePattern(char c1, char c2, char c3, char c4, char c5,
                  int n1,  int n2,  int n3,  int n4,  int n5, int length)  {
    while ((n1 > 0) && (length > 0))
      	 writeCharFixCount(c1, &n1, &length);

    while ((n2 > 0) && (length > 0))
	writeCharFixCount(c2, &n2, &length);

    while ((n3 > 0) && (length > 0))
	writeCharFixCount(c3, &n3, &length);

    while ((n4 > 0) && (length > 0))
	writeCharFixCount(c4, &n4, &length);

    while ((n5 > 0) && (length > 0))
       writeCharFixCount(c5, &n5, &length);

    printf("\n");   /* advance the cursor to the beginning of a new line */
}

void writeCharFixCount(char c, int *count1, int *count2) {
/* writes one copy of character c and decrements count1 and count2 */   
    printf("%c", c);
    (*count1)--;
    (*count2)--;
}
