public class Driver
{
	public static void main(String args[])
	{
		Stack stack = new Stack();
		Queue queue = new Queue();
		Integer i;

		// ********** 
		// Stack Test
		// **********
		// Expected to be empty
		if(stack.isEmpty())
			System.out.println("Stack is empty.");
		else
			System.out.println("Stack contains items.");

		try
		{
			stack.push(1);
			stack.push(2);
			stack.push(3);
			stack.pop();

			// Expected to be not empty
			if(stack.isEmpty())
				System.out.println("Stack is empty.");
			else
				System.out.println("Stack contains items.");

			stack.push(4);
			
			// Expected output: 4, 2, 1
			while(!stack.isEmpty())
			{
				i = stack.top();
				stack.pop();
				System.out.println(i.toString());
			}
			// Expected to throw exception that will be caught.
			stack.top();
		}
		catch(EmptyStackException e)
		{
			System.out.println("Exception: " + e.getMessage());
		}

		// **********
		// Queue Test
		// **********
		// Expected to be empty
		if(queue.isEmpty())
	   		System.out.println("Queue is empty.");
		else
			System.out.println("Queue contains items.");

		try
		{
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);

			// Expected to be not empty
			if(queue.isEmpty())
				System.out.println("Queue is empty.");
			else
				System.out.println("Queue contains items.");

			queue.dequeue();
			queue.enqueue(4);

			// Expected output: 2, 3, 4
			while(!queue.isEmpty())
			{
				i = queue.front();
				queue.dequeue();
				System.out.println(i.toString());
			}

			// Expected to throw an exception that will be caught.
			queue.front();
		}
		catch(EmptyQueueException e)
		{
			System.out.println("Exception: " + e.getMessage());
		}
	}
}
