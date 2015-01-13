/**@author Matthew Morrissey
 **@author David Thompson
 **@version 1.3
 **Queue class. Implements a Queue using a LinkedList
 **PLEASE NOTE: This implementation only works for Integers*/

import java.util.LinkedList;

public class Queue
{
	private LinkedList<Integer> queue;

	/**Default constructor. Creates an empty Queue.*/
	public Queue()
	{
		queue = new LinkedList<Integer>();
	}

	/**Adds the element to the back of the Queue.
	 **@param element The element to be added to the Queue.*/
	public void enqueue(int element)
	{
		queue.add(new Integer(element));
	}

	/**Deletes the element on the back of the Queue.
	 **Does not return the element removed.
	 **@throws EmptyQueueException*/
	public void dequeue()throws EmptyQueueException
	{
		if(isEmpty())
			throw new EmptyQueueException("Queue is empty!");
		
		queue.removeFirst();
	}

	/**Removes and returns the element at the front of the Queue.
	 **@return The element on the front of the Queue.
	 **@throws EmptyQueueException*/
	public Integer front() throws EmptyQueueException
	{
		if(isEmpty())
			throw new EmptyQueueException("Queue is empty!");

		return queue.getFirst();
	}

	/**Tests to see if the Queue is empty.*/
	public boolean isEmpty()
	{
		return queue.size()==0;
	}
}
