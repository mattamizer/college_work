/*  This is the driver module to test ADT Queue */

#include "Queue.h"
#include <stdio.h>      /* standard header file */
#include <stdlib.h>     /* for atoi() function */

#define MAX 80

int  main()  {
   char buf[MAX];
   QUEUE q;
   int choice, element;

   printf("Welcome to the Queue Program.\n");
   printf("This program creates a queue and manipulates the queue\n");
   printf("Please study the header file before using the functions\n");

   initialize(&q);

   do {
      printf("\n1: Insert an element in the Queue\n");
      printf("2: Delete an element in the Queue\n");
      printf("3: Check for Empty Queue\n");
      printf("4: Get the first element in the Queue\n");
      printf("5: Print the elements in the Queue\n");
      printf("6: Quit the program\n\n");

      printf("Please choose an option: ");
      fgets(buf, MAX, stdin);
      choice = atoi(buf);

      switch(choice) {
      	case 1: printf("Please enter the element to be inserted: ");
                fgets(buf, MAX, stdin);
                element = atoi(buf);
                enqueue(&q, element);
                break;

        case 2: if (dequeue(&q, &element))
                      printf("Element %d is deleted\n", element);
                else printf("Queue is empty. Nothing to delete\n");
                break;

        case 3: if (isEmpty(q))
                   printf("Queue is empty\n");
                else printf("Queue is non empty\n");
                break;

        case 4: if (front(q, &element))
                     printf("The first element in the queue is %d\n", element);
                else printf("Queue is empty.\n");
                break;

        case 5: printQueue(q);
                break;

        case 6: printf("Good bye!\n");
                break;

        default: printf("Illegal option\n");
      }  /* switch */
   } while (choice != 6);

   return 0;
}  /* main()  */
