/*  This is the header file for Assignment #9  */

#ifndef ASSG9_H
#define ASSG9_H

#include <stdio.h>  /* for FILE * in function prototypes */

#define TRUE 1
#define FALSE 0
#define MAX 512

typedef int boolean;
typedef char * String;

typedef struct node {
   String element;
   struct node *next;
}NODE;

typedef struct {
   NODE *head, *tail;
}SLL;


/* This function initializes the list to be an empty list. This
   function must be called before any operations are performed
   on the list.
 */
void initialize(SLL *list);



/* returns TRUE if list is empty returns FALSE otherwise */
boolean isEmpty(SLL list);




/* str is inserted in the list so the list is always kept sorted */
void insert(SLL *list, String str);


/* If the list is empty or if str does not appear in the
   list, FALSE is returned.
   If str appears in the list, the function deletes
   str and returns TRUE.
 */
boolean delete(SLL *list, String str);



/* prints the elements of the list to the output file
   from beginning to end */
void printForward(SLL list, FILE *fp);




/* prints the elements of the list to the output file
   backward - from end to beginning     */
void printBackward(SLL list, FILE *fp);

#endif
