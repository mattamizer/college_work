/**@author Matthew Morrissey
 **@author David Thompson
 **@version 1.3
 **Stack class. Uses queues to implement a stack. 
 **PLEASE NOTE: This implementation only works for Integers*/

public class StackUsingQueue
{
	private Queue queue1, queue2;

	/**Default constructor: creates an empty Stack.*/
	public StackUsingQueue()
	{
		queue1 = new Queue();
		queue2 = new Queue();
	}

	/**Deletes the top element on the Stack.
	 **Does not return the element removed.
	 **@throws EmptyStackException*/
	public void pop() throws EmptyStackException
	{
		try
		{
			queue1.dequeue();
		}
		catch(EmptyQueueException e)
		{
			throw new EmptyStackException("Stack is empty!");
		}
	}
	
	/**Pushes an element onto the top of the Stack.
	 **@param element The element to be pushed onto the Stack*/
	public void push(int element)
	{
		// An exception should not happen since we check for empty queues.
		try
		{
			// Enqueue on second queue
			queue2.enqueue(new Integer(element));
		
			// Enqueue all of queue1 onto queue2
			while(!queue1.isEmpty())
			{
				queue2.enqueue(queue1.front());
				queue1.dequeue();
			}

			// Swap references
			Queue temp = queue1;
			queue1 = queue2;
			queue2 = temp;
		}
		catch(EmptyQueueException e)
		{
			// Do nothing
		}
	}

	/**Removes and returns the element on the top of the Stack.
	 **@return The element on the top of the Stack
	 **@throws EmptyStackException*/
	public Integer top() throws EmptyStackException
	{
		try
		{
			return queue1.front();
		}
		catch(EmptyQueueException e)
		{
			throw new EmptyStackException("Stack is empty!");
		}
	}
	
	/**Tests to see if the Stack is empty*/
	public boolean isEmpty()
	{
		return queue1.isEmpty();
	}
 }
