/**@author Matthew Morrissey
 **@author David Thompson
 **@version 1.3
 **Stack class. Uses a LinkedList to implement a stack
 **PLEASE NOTE: This implementation only works for Integers*/

import java.util.LinkedList;

public class Stack
{
	private LinkedList<Integer> stack;

	/**Default constructor: creates an empty Stack.*/
	public Stack()
	{
		stack = new LinkedList<Integer>();
	}

	/**Deletes the top element on the Stack.
	 **Does not return the element removed.
	 **@throws EmptyStackException*/
	public void pop() throws EmptyStackException
	{
		if(isEmpty())
			throw new EmptyStackException("Stack is empty!");
		
		stack.removeLast();
	}
	
	/**Pushes an element onto the top of the Stack.
	 **@param element The element to be pushed onto the Stack*/
	public void push(int element)
	{
		stack.add(new Integer(element));
	}

	/**Removes and returns the element on the top of the Stack.
	 **@return The element on the top of the Stack
	 **@throws EmptyStackException*/
	public Integer top() throws EmptyStackException
	{
		if(isEmpty())
			throw new EmptyStackException("Stack is empty!");

		return stack.getLast();
	}
	
	/**Tests to see if the Stack is empty*/
	public boolean isEmpty()
	{
		return stack.size()==0;
	}
 }
