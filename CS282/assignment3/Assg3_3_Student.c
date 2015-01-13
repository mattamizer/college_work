#include <stdio.h>

/* Name:  Your name goes here
   E-mail: your e-mail
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 3
   Description:  In this assignment, we use the code
       provided by the instructor and write code to draw various
       shapes on the screen.

   Concepts used: loops.

   Known Bugs: None
 */

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
void writePattern(char, char, char, char, char,
                   int,  int,  int,  int,  int,  int);

/* writes one copy of character c and decrements count1 and count2 */
void writeCharFixCount(char, int *, int *);

void drawBox(int);
/* draws a square box with chars '*' and '.'.  For example if the
   parameter value is 3, the following box would be drawn.
   *..
   **.
   ***
*/

void drawSlantRight(int);
/* draws a line slanting to the right with char '*'.  For example,
   if the parameter value is 3, the following would be drawn.
   *
    *
     *
 */

void drawSlantLeft(int);
/* draws a line slanting to the left with char '*'.  For example,
   if the parameter value is 3, the following would be drawn.
      *
     *
    *
 */

void drawTriangle(int);
/* draws a triangle with the number of rows equal to the parameter
   value.  For example, if the parameter value is 3, the following
   would be drawn on the screen.
       *
      ***
     *****
*/

void drawX(int);
/* draws a X on the scren.  For example, if the parameter value is 3,
   the following would be drawn on the screen.
       *   *
        * *
         *
        * *
       *   *
*/

void drawXmasTree(int);
/* draws a shape resembling a Xmas tree on the screen.  For example,
   if the parameter value is 3, the following would be drawn.
        *
       ***
       ***
      *****
      *****
*/

int main() {
   int size;

   printf("Please enter an integer in the range 1-8 both inclusive: ");
   scanf("%d", &size);

   drawBox(size);
   printf("\n\n");

   drawSlantRight(size);
   printf("\n\n");

   drawSlantLeft(size);
   printf("\n\n");

   drawTriangle(size);
   printf("\n\n");

   drawX(size);
   printf("\n\n");

   drawXmasTree(size);
   printf("\n\n");

   return 0;
}

void drawBox(int size){
  /* to be filled by the student */
}

void drawSlantRight(int size) {
/* to be filled by the student */
}

void drawSlantLeft(int size) {
/* to be filled by the student */
}

void drawX(int size) {
/* to be filled by the student */
}

void drawTriangle(int size) {
/* to be filled by the student */
}

void drawXmasTree(int size) {
/* to be filled by the student */
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

void writeCharFixCount(char c, int *count1, int *count2)  {
/* writes one copy of character c and decrements count1 and count2 */
    printf("%c", c);
    (*count1)--;
    (*count2)--;
}
