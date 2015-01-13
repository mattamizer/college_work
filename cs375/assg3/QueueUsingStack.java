/**@author Matthew Morrissey
 **@author David Thompson
 **@version 1.3
 **Queue class. Implements a Queue using a Stack
 **PLEASE NOTE: This implementation only works for Integers*/

public class QueueUsingStack
{
	private Stack stack1, stack2;

	/**Default constructor. Creates an empty Queue.*/
	public QueueUsingStack()
	{
		stack1 = new Stack();
		stack2 = new Stack();
	}

	/**Adds the element to the back of the Queue.
	 **@param element The element to be added to the Queue.*/
	public void enqueue(int element)
	{
		// An exception should not happen here since we check for empty stacks.
		try
		{
			// Push everything from stack1 to stack2
			while(!stack1.isEmpty())
			{
				Integer item = stack1.top();
				
				stack1.pop();
				stack2.push(item);
			}

			// Push new element to stack1
			stack1.push(new Integer(element));
	
			// Push everything from stack2 back to stack1
			// Now the new element is at the bottom where it should be
			while(!stack2.isEmpty())
			{
				Integer item = stack2.top();
				stack2.pop();
				stack1.push(item);
			}
		}
		catch(EmptyStackException e)
		{
			// Do nothing.
		}
	}

	/**Deletes the element on the back of the Queue.
	 **Does not return the element removed.
	 **@throws EmptyQueueException*/
	public void dequeue() throws EmptyQueueException
	{
		try
		{
			stack1.pop();
		}
		catch(EmptyStackException e)
		{
			throw new EmptyQueueException("Queue is empty!");
		}
	}

	/**Removes and returns the element at the front of the Queue.
	 **@return The element on the front of the Queue.
	 **@throws EmptyQueueException*/
	public Integer front() throws EmptyQueueException
	{
		try
		{
			return stack1.top();
		}
		catch(EmptyStackException e)
		{
			throw new EmptyQueueException("Queue is empty!");
		}
	}

	/**Tests to see if the Queue is empty.*/
	public boolean isEmpty()
	{
		return stack1.isEmpty() && stack2.isEmpty();
	}
}
