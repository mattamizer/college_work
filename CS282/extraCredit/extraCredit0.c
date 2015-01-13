/* Name: Matthew Morrissey
   Course Name: CS 282 Section 02
   Description: Read a character from the terminal and then use a switch statement to determine how to deal with the character.
		Loop until the user enters a Q or a q.
   Concepts Used: Looping, I/O, Switch Statements
   Time Estimate: 10 minutes
   Known Bugs: N/A    */
#include <stdio.h>

int main(){
	char input;
	do{
		printf("Please input a single character or digit. Characters may be upper or lower case, use q to quit:  ");
		scanf("%c", &input);
		getchar();//Clear the buffer
		//Switch statment to cover various cases of input.
		switch(input){
			case 'a':
			case 'e':
			case 'i':
			case 'o':
			case 'u':
				printf("You have entered a lower case vowel.\n");
				break;
			case 'A':
			case 'E':
			case 'I':
			case 'O':
			case 'U':
				printf("You have entered an upper case vowel.\n");
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				printf("You have entered a digit.\n");
				break;
			default:
				printf("You have entered some other character.\n");
				break;
		}
	}while(!(input == 'Q' || input == 'q'));//Loop until user enters 'Q' or 'q'
	return 0;
}
