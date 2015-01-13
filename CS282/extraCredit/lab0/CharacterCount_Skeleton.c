/* This program reads characters from a file and
   reports the count of lower clase characters,
   count of upper case characters, and count of
   digits.

   int fgetc(FILE *fp);
   Gets the next character from the file associated with
   fp and returns the value of the character read.  If the
   end-of-file is encountered, the end-of-file character
   is set and EOF is returned.  If an error occurs, the error
   indicator is set and EOF is returned

   int fputc(int c, FILE *fp);
   Converts the argument c to an unsigned char and writes it
   into the file associated with fp.  If the call fputc(c) is
   successful, it returns
   (int) (unsigned char)c
  */

#include <stdio.h>  // standard header file
#include <ctype.h>
#include <stdlib.h> // for the exit function

int main() {
   int ch, i, upperCaseLetterCount[26];
   int lowerCaseLetterCount[26];
   int digitCount[10];
   FILE * fpin, *fpout;

   // open the file Assg1.c for input and assign the
   // file pointer to fpin

   // open the file CharacterCount_Output.txt file for
   // output and assign the file pointer to fpout

   // initialize the arrays so that they truly
   // reflect the count of characters so far

   // read one char at a time from the input file using fgetc
   // check to see whether it is an uppercase character
   // or a lowercase character or a digit character and
   // increment the count appropriately in the arrays.
   // Keep doing this until you reach end of the input file

   fprintf(fpout, "Here is the count of upper case characters\n");
   for (i = 0; i < 26; i++) {
      if (i % 6 == 0) fprintf(fpout, "\n");
      fprintf(fpout, "%4c:%3d", ... , upperCaseLetterCount[i]); // you need to complete this
   }

   fprintf(fpout, "\n\nHere is the count of lower case characters\n");
   for (i = 0; i < 26; i++) {
      if (i % 6 == 0) fprintf(fpout, "\n");
      fprintf(fpout, "%4c:%3d", ..., lowerCaseLetterCount[i]); // you need to complete this
   }

   fprintf(fpout, "\n\nHere is the count of digit characters\n");
   for (i = 0; i < 10; i++) {
      if (i % 6 == 0) fprintf(fpout, "\n");
      fprintf(fpout, "%4c:%3d", ..., digitCount[i]); // you need to complete this
   }

   // close the two files that you opened
 }

 /* These are the functions available in ctype.h
 int isalphanum(int c); - Returns true if c is alphanumeric (alphabetic or numeric)

 int isalpha(int c);    - Returns true if c is alphabetic

 int iscntrl(int c);    - Returns true if c is a control character, such as Ctrl+B

 int isdigit(int c);    - Returns true if c is a digit

 int islower(int c);    - Returns true if c is a lowercase character

 int ispunct(int c);    - Returns true if c is a punctuation character (any
                          printing character other than a space or an
                          alphanumeric character)

 int isspace(int c);    - Returns true if c is a whitespace character: space,
                          newline, formfeed, carriage return, vertical tab,
                          or possibly, another implementation-defined character

 int isupper(int c);    - Returns true if c is an uppercase character

 int isxdigfit(int c);  - Returns true if c is a hexadeciaml character

 int tolower(int c);    - If the argument is an uppercase character, returns
                          the lowercase version; otherwise, just returns the
                          original argument

 int toupper(int c);    - If the argument is an lowercase character, returns
                          the uppercase version; otherwise, just returns the
                          original argument

 Plus some other functions
 */






