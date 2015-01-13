/* This is the driver module for sortable doubly linked list of strings. */

#include "Sortable_DLL.h"    // user defined header file
#include <string.h>          // for string functions
#include <stdio.h>           // standard header file

int main() {
   DLL list;
   char buf[MAX], *p;

   int choice, element;

   printf("Welcome to the doubly linked list Program.\n");
   printf("This program creates and manipulates a doubly linked list\n");
   printf("Please study the header file before using the functions\n");

   initialize(&list);

   do {
      printf("\n1: Check for Empty list\n");
      printf("2: Insert a string at the front of the list\n");
      printf("3: Insert a string at the end of the list\n");
      printf("4: Delete a string from the list\n");
      printf("5: Sort the elements of the list in ascending order\n");
      printf("6: Print the elements of the list from beginning to end\n");
      printf("7: Print the elements of the list in the reverse order\n");
      printf("8: Quit the program\n\n");

      printf("Please choose an option: ");
      fgets(buf, MAX, stdin);
      choice = atoi(buf);

      switch(choice) {
         case 1: if (isEmpty(list))
                    printf("List is empty\n");
                 else printf("List is non empty\n");
                 break;

         case 2: printf("Please enter a string to be inserted at the front: ");
                 fgets(buf, MAX, stdin);
                 if ((p = strchr(buf,'\n')) != NULL) *p = '\0';
                 insertAtFront(&list, buf);
                 break;

         case 3: printf("Please enter a string to be inserted at the end: ");
		         fgets(buf, MAX, stdin);
		         if ((p = strchr(buf,'\n')) != NULL) *p = '\0';
		         insertAtEnd(&list, buf);
                 break;

         case 4: printf("Please enter a string to be deleted from the list: ");
                 fgets(buf, MAX, stdin);
                 if ((p = strchr(buf,'\n')) != NULL) *p = '\0';

                 if (delete(&list, buf))
                     printf("String %s is deleted from the list\n", buf);
                 else {
                    printf("String %s does not appear in the list\n", buf);
                    printf("Deletion not performed\n");
                 }
                 break;

         case 5: printf("WARNING! Sorting will rearrange the items in the list\n");
                 printf("This operation is irrevocable.  Do you want to continue? ");
                 printf("Press Y for Yes and N for No: ");
                 fgets(buf, MAX, stdin);
                 if ( (buf[0] == 'Y') || (buf[0] == 'y')) sort(&list);
                 break;

         case 6: printForward(list);
                 break;

         case 7: printBackward(list);
                 break;

         case 8: printf("Good bye!\n");
                 break;

         default: printf("Illegal option\n");

      }  /* switch */
   } while (choice != 8);

   return 0;
}  /* main()  */
