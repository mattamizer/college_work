#include "Queue.h"
#include <stdio.h> //standard header file
#include <stdlib.h>//for malloc()
#include <assert.h>//for assert()

void initialize(QUEUE *q){
     q -> front = q -> rear = NULL;
}

boolean isEmpty(QUEUE q){
     return(q.front == NULL);
}

void enqueue(QUEUE *q, int x){
     NODE *temp;
     temp = (NODE *)malloc(sizeof(NODE));
     assert(temp);
     temp -> element = x;
     temp -> next = NULL;
     if(isEmpty(*q))//queue is empty
          q -> front = q -> rear = temp;
     else{ //queue is not empty
          q -> rear -> next = temp;
          q -> rear = temp;
     }
}

boolean dequeue(QUEUE *q, int *x){
     NODE *temp;
     if(isEmpty(*q))
          return FALSE;
     temp = q -> front;
     if(q -> front == q -> rear){//queue contains only one element
          q -> front = q -> rear = NULL;
          *x = temp -> element;
          free(temp);
     }
     else{ //queue contains more than one element
          q -> front = q -> front -> next;
          *x = temp -> element;
          free(temp);
     }
     return TRUE;
}

boolean front(QUEUE q, int *x){
     if(isEmpty(q))
          return FALSE;
     else{
          *x = q.front -> element;
          return TRUE;
     }
}

void printQueue(QUEUE q){
     NODE *temp;
     temp = q.front;
     while(temp != NULL){
          printf("%d  ", temp -> element);
          temp = temp -> next;
     }
}
