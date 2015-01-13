/* 
   Name:  Matthew Morrissey
   Course: Unix Systems Programming
   Semester: Spring 10
   Assignment #: 9
   Time Estimate: 2 hours and I was within my estimate
   Known Bugs: None
 */





#include "Assg9.h"
#include <stdlib.h>         // for memory allocation functions
#include <stdio.h>          // standard header file
#include <assert.h>         // for assert macro
#include <string.h>         // for strcmp function

/* This function initializes the list to be an empty list. This
   function must be called before any operations are performed
   on the list.
 */
void initialize(SLL *list){
  list -> head = list -> tail = NULL;
}



/* returns TRUE if list is empty returns FALSE otherwise */
boolean isEmpty(SLL list){
  return(list.head == NULL);
}




/* str is inserted in the list so the list is always kept sorted */
void insert(SLL *list, String str){
  NODE *newNode, *temp, *previous; 
  
  //Allocate space for the new node and its associated element
  newNode = (NODE*)malloc(sizeof(NODE));
  assert(newNode);
  newNode -> element = (char*) malloc(strlen(str) + 1);
  assert(newNode -> element);
  strcpy(newNode -> element, str);

  newNode -> next = NULL;
  temp = previous = list -> head;
	
  //If the list is empty
  if(isEmpty(*list))
    list -> head = list -> tail = newNode;
	
  //Iterate over the list to see where newNode fits to keep the list sorted
  while(temp != NULL){
    //str is less than the first element in the list
    if(strcmp(str, temp -> element) <= 0){
      newNode -> next = list -> head;
      list -> head = newNode;
      break;
    }
    //str is greater than the only element in the list
    else if((temp == list -> tail) && (strcmp(str, temp -> element) >= 0)){
      list -> tail = newNode;
      temp -> next = newNode;
      break;
    }
    //str is greater than the current element but less than the next element
    else if((strcmp(str, temp -> element) >= 0) && (strcmp(str, temp -> next -> element) <= 0)) {
      temp = temp -> next;
      previous -> next = newNode;
      newNode -> next = temp; 
      break;
    }
    //None of the cases were met, so move to the next node
    else{
      previous = temp = temp -> next;
    }
  }
}

/* If the list is empty or if str does not appear in the
   list, FALSE is returned.
   If str appears in the list, the function deletes
   str and returns TRUE.
 */
boolean delete(SLL *list, String str){
  NODE *temp, *previous;
  previous = temp = list -> head;
  //iterate through the list looking for the string
  while(temp != NULL && (strcmp(str, temp -> element) != 0)){
    previous = temp;
    temp = temp -> next;
  }
  if(temp == NULL)
    return FALSE;//list was empty or string was not found
          
   //string is the only element in the list
   if(list -> head == list -> tail){
     free(temp -> element);
     free(temp);
     list -> head = list -> tail = NULL;
   }
     
   //string is the first element in the list
   else if(list -> head == temp){
     list -> head = temp -> next;
     free(temp -> element);
     free(temp);
   }
     
   //string is last element in the list
   else if(list -> tail == temp){
     list -> tail = previous;
     previous -> next == NULL;
     free(temp -> element);
     free(temp);
   }
     
   //string is an element somewhere in the middle
   else{
     previous -> next = temp -> next;
     free(temp -> element);
     free(temp);
   }
   return TRUE;
}



/* prints the elements of the list to the output file
   from beginning to end */
void printForward(SLL list, FILE *fp){
  NODE *temp;
  temp = list.head;
  while(temp != NULL){
    fprintf(fp, "%s", temp -> element);
    temp = temp -> next;
  }
  fprintf(fp, "\n\n");
}



/* prints the elements of the list to the output file
   backward - from end to beginning     */
void printBackward(SLL list, FILE *fp){
  NODE *end, *previous;
  
  end = list.tail;
  previous = NULL;
  //print the tail
  fprintf(fp, "%s", end -> element);
  //loop over the list printing one prior the the current last element
  while(previous != list.head){
    previous = list.head;
    while(previous -> next != end)
      previous = previous -> next;
    end = previous;
    fprintf(fp, "%s", previous -> element);
  }
}
