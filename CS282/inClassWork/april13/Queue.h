/*  This is the header file for linked list implementation of the QUEUE ADT.
 */
#ifndef QUEUE_H
#define QUEUE_H

#define TRUE 1
#define FALSE 0

typedef int boolean;

typedef struct node {
   int element;
   struct node *next;
}NODE;


typedef struct {
  NODE *front, *rear;
}QUEUE;


/* This function initializes q to be an empty queue.  This function
   must be called before you do any queue operations.  */
void initialize(QUEUE *q);


/* returns TRUE if q is empty returns FALSE otherwise */
boolean isEmpty(QUEUE q);

/* If q is non-empty, this function returns the first element
   in *ele and returns TRUE;  If q is empty, FALSE is returned.   */
boolean front(QUEUE q, int *ele);


/* This function first checks whether the queue is empty.  If it is
   empty, FALSE is returned and *ele is not modified.  If the queue
   is not empty, it deletes the first element in the queue places
   the deleted element in *ele and TRUE is returned.   */
boolean dequeue(QUEUE *q, int *ele);


/* x is inserted at the end of the queue. */
void enqueue(QUEUE *q, int x);


/* prints the elements of the queue on the screen */
void printQueue(QUEUE q);

#endif