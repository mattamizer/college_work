#include <stdio.h>
#include <stdlib.h>

void drawDiamond(int);
/* 
  Draws a diamond of size (int) (as long as it is an ODD number) on the screen consisting of * and <space>.
  For example, if the parameter was 9:
          *
        * * *
      * * * * *
    * * * * * * *
  * * * * * * * * *
    * * * * * * *
      * * * * * 
        * * *
          *
*/

void printLine(int, int);
/*
  Draws one line of the diamond
*/

void drawStaggeredLine(int);
/*
  Draws an (int) by (int) box with every other line staggered.
  For example, if the user entered 4:
  * * * *
   * * * *
  * * * *
   * * * *
*/


int main(){
   int size;
   printf("Please enter an integer in the range of 1 - 26 inclusive: ");
   scanf("%d", &size);
   getchar();
   //Make sure the user entered number is in range or kill
   if(size < 1 || size > 26){
      printf("Invalid input!\n");
      exit(1);
   }
   //Print the shapes using the user enterd number
   drawDiamond(size);
   printf("\n\n\n\n");
   drawStaggeredLine(size);
   return 0;
}

//Draw a diamond of size <size>
void drawDiamond(int size){
   //Make sure the size is odd, else subtract one to make it odd
   if(size % 2 == 0){
      printf("Cannot draw a diamond with an even number!\n");
      printf("Decrementing number by 1.\n");
      size -= 1;
   }
   //Initialize loop control variable
   int i = 1;
   while(i <= size){
      //Call printLine to draw the line using size and the current
      //number of stars to print (i)
      printLine(size, i);
      i += 2;
   }
   //Reset size to print the lower half of the diamond
   i = size - 2;
   while(i >= 1){
      //Call printLine to draw the line using size and the current
      //number of stars to print (i)
      printLine(size, i);
      i -= 2;
   }
}

//Print a single line of the diamond using the current size
//and the number of stars to print
void printLine(int size, int numStars){
   //Calculate the number of blank spaces to print
   int numSpaces = size - numStars; 
   //Initialize loop control variable
   int i = 0;
   //Print the correct number of blank spaces
   while(i++ < numSpaces)
      printf(" ");
   //Resest the loop control variable
   i = 0;
   //Print the correct number of asterisks with a space between them
   while(i++ < numStars)
      printf("* ");
   //Advance cursor to the next line
   printf("\n");
}

//Draw a checkerboard pattern of size <size>
void drawStaggeredLine(int size){
   //Initialize the loop control variables
   int counter = 0;
   int lineCount = 0;
   //Print lines while counter is less than size
   while(counter < size){
      //If on an even numbered line, print the "*" first
      if(counter % 2 == 0){
         while(lineCount++ < size)
            printf("* ");
      printf("\n");
      lineCount = 0;
      }
      //If on an odd numbered line, print the " " first 
      else{
         while(lineCount++ < size)
            printf(" *");
      printf("\n");
      lineCount = 0;
      }
      counter++;
   } 
}
