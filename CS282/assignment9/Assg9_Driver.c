/*
   Name: Prof. Mahadev
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 9
   Description:  This program opens an input file of strings and inserts them
                 into a singly linked list of strings. When the strings are
                 inserted, they are inserted so as to maintain the
                 list in the sorted order.
                 When all the strings are inserted, the list is printed to an
                 output file in the ascending and in descending order.

                 Then the entire list is deleted
   Known Bugs:   None
   Time estimate:  Two hours
*/

#include "Assg9.h"     /* user created header file */
#include <string.h>    /* for strchr function */
#include <stdio.h>     /* standard header file */
#include <assert.h>    /* for the assert macro  */

int main() {
   SLL list;
   char buf[MAX], *p;
   FILE *fpin, *fpout;

   fpin = fopen("Input.txt", "r");
   assert(fpin != NULL);

   fpout = fopen("Assg9_Output.txt", "w");
   assert(fpout != NULL);

   initialize(&list);  // start with an empty list

   /* read one line at a time from the file, and insert it
      into the list */
   while (fgets(buf, MAX, fpin) != NULL) {
       p = strchr(buf, '\n');
       if (p != NULL) *p = '\0';  // get rid of the '\n'
       insert(&list, buf);
   }

   if ( !isEmpty(list) ) {
   	    fprintf(fpout, "The elements in the ascending order: \n\n");
        printForward(list, fpout);

        fprintf(fpout, "The elements in the descending order: \n\n");
        printBackward(list, fpout);
   }
   else fprintf(fpout, "The list is empty");

   fprintf(fpout, "\n\n");

   fseek(fpin, 0, SEEK_SET);
   // bring the input file pointer to the beginning of the file

   // read one line at a time from the file, and delete it
   // from the list
   while (fgets(buf, MAX, fpin) != NULL) {
       p = strchr(buf, '\n');
       if (p != NULL) *p = '\0';  // get rid of the '\n'
       if (delete(&list, buf))
           fprintf(fpout, "%s is successfully deleted from the list\n\n", buf);
       else
           fprintf(fpout, "%s is not found in the list.  Deletion not performed\n\n",
                     buf);
   }

   if ( !isEmpty(list) ) {
   	fprintf(fpout, "The elements in the ascending order: \n\n");
        printForward(list, fpout);

        fprintf(fpout, "The elements in the descending order: \n\n");
        printBackward(list, fpout);
   }
   else fprintf(fpout, "\n\nThe list is empty");

   fclose(fpin);
   fclose(fpout);

   return 0;
}
