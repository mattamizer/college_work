/*  This is the implemenatation module for sortable doubly
    linked list of Strings */

#include "Sortable_DLL.h"   // user defined header file
#include <stdlib.h>         // for memory allocation functions
#include <stdio.h>          // standard header file
#include <assert.h>         // for assert macro
#include <string.h>         // for strcmp function

/* This function initializes the list to be an empty list.
   This function ** must ** be called before any
   operations are performed on the list.
 */
void initialize(DLL *list)  {
     list -> head = list -> tail = NULL;
}

/* returns TRUE if list is empty returns FALSE otherwise */
boolean isEmpty(DLL list)  {
     return (list.head == NULL);
}

/* prints the elements of the list on the screen  */
void printForward(DLL list)  {
     NODE *temp;
     temp = list.head;
     while(temp != NULL){
         printf("%s ", temp -> element);
         temp = temp -> next;
     }
}


/* prints the elements of the list in the reverse order on the screen  */
void printBackward(DLL list)  {
     NODE *temp;
     temp = list.tail;
     while(temp != NULL){
         printf("%s ", temp -> element);
         temp = temp -> previous;
     }
}


/* str is inserted at the beginning of the list */
void insertAtFront(DLL *list, String str) {
     NODE *newNode;
     newNode = (NODE *)malloc(sizeof(NODE));//allocate memory for the node
     assert(newNode);
     newNode -> element = (char *)malloc(strlen(str)+1);//allocate memory for the string
     assert(newNode -> element);
     strcpy(newNode -> element, str);
     newNode -> previous = newNode -> next = NULL;
     if(isEmpty(*list))//list is empty
          list -> head = list -> tail = newNode;
     else{//list is not empty
          newNode -> next = list -> head;
          list -> head -> previous = newNode;
          list -> head = newNode;
     }
}

/* str is inserted at the end of the list */
void insertAtEnd(DLL *list, String str)  {
     NODE *newNode;
     newNode = (NODE *)malloc(sizeof(NODE));//allocate memory for the node
     assert(newNode);
     newNode -> element = (char *)malloc(strlen(str)+1);//allocate memory for the string
     assert(newNode -> element);
     strcpy(newNode -> element, str);
     newNode -> previous = newNode -> next = NULL;
     if(isEmpty(*list))//list is empty
          list -> head = list -> tail = newNode;
     else{//list is not empty
          newNode -> previous = list -> tail;
          list -> tail -> next = newNode;
          list -> tail = newNode;
     }
}

/* This function first checks whether the list is empty.  If it is empty, FALSE
   is returned. If the list is not empty and if str appears in the list, it deletes
   str and returns TRUE.  If str does not appear in the list FALSE is returned.
 */
boolean delete(DLL *list, String str)  {
     NODE *temp;
     temp = list -> head;
     //iterate through the list looking for the string
     while(temp != NULL && (strcmp(str, temp -> element) != 0))
          temp = temp -> next;
     if(temp == NULL)
          return FALSE;//list was empty or string was not found
          
     //string is the only element in the list
     if(temp -> next == NULL && temp -> previous == NULL){
          free(temp -> element);
          free(temp);
          list -> head == NULL;
          list -> tail == NULL;
     }
     
     //string is the first element in the list
     else if(temp -> previous == NULL){
          list -> head = temp -> next;
          temp -> next -> previous = NULL;
          free(temp -> element);
          free(temp);
     }
     
     //string is last element in the list
     else if(temp -> next == NULL){
          list -> tail = temp -> previous;
          temp -> previous -> next == NULL;
          free(temp -> element);
          free(temp);
     }
     
     //string is an element somewhere in the middle
     else{
          temp -> previous -> next = temp -> next;
          temp -> next -> previous = temp -> previous;
          free(temp -> element);
          free(temp);
     }
     return TRUE;
     
}


void sort(DLL *list) {
     NODE *start, *lowVal, *tempNode;
     char *temp;
     //if list is empty or has one element there is nothing to sort
     if(list -> head == list -> tail)
          return;
     //set min to the head of the list. min will be the starting point of each iteration over the list
     start = list -> head;
     while(start != NULL){
          lowVal = start;
          tempNode = start -> next;
          while(tempNode != NULL){
               //compare the element fields and store the smaller node in lowVal
               if(strcmp(tempNode -> element, lowVal -> element) < 0)
                    lowVal = tempNode;
               tempNode = tempNode -> next;
          }
          //swap the element fields of lowVal and the current start
          temp = start -> element;
          start -> element = lowVal -> element;
          lowVal -> element = temp;
          //increment start
          start = start -> next;
     }
}  /* sort */
