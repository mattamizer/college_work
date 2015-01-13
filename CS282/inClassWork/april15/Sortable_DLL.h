/*  This is the header file for sortable doubly linked list */

#ifndef Sortable_DLL_H
#define Sortable_DLL_H

#define TRUE 1
#define FALSE 0
#define MAX 512

typedef char * String;
typedef int boolean;

typedef struct node{
   String element;
   struct node *next, *previous;
}NODE;

typedef struct {
   NODE *head, *tail;
}DLL;


/* This function initializes the list to be an empty list.
   This function ** must ** be called before any
   operations are performed on the list.
 */
void initialize(DLL *list);


/* returns TRUE if list is empty returns FALSE otherwise */
boolean isEmpty(DLL list);


/* If the list is empty or if str does not appear in the
   list, FALSE is returned.
   If str appears in the list, the function deletes
   str and returns TRUE.
 */
boolean delete(DLL *list, String str);


/* str is inserted at the beginning of the list */
void insertAtFront(DLL *list, char *str);


/* str is inserted at the end of the list */
void insertAtEnd(DLL *list, char *str);


/* prints the elements of the list on the screen
   from beginning to end */
void printForward(DLL list);


/* prints the elements of the list on the screen
   in the reverse order */
void printBackward(DLL list);


/* sorts the elements in the list in the ascending order of element.
   This function modifies the list so that the original order
   of items is lost.  */
void sort(DLL *list);

#endif
