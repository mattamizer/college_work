/**
 * @(#)CommandInterpreter.java
 *
 *
 * Matthew Morrissey 
 * version 1.00 2009/4/18
 * CS 140
 * Allows the user to input basic commands to control the Agent
 */
import java.util.Scanner;

public class CommandInterpreter
{
	public static void run(Agent agent)
	{
		Scanner sc = new Scanner(System.in);
		boolean contin = true;
		do
		{
			System.out.print("-->  ");
			String command = sc.next();
			if(command.equalsIgnoreCase("quit"))
				contin = false;
			else if(command.equalsIgnoreCase("help"))
			{
				System.out.println("Available commands:");
				System.out.println("Go: Moves the Agent through the Space's portal.");
				System.out.println("Help: Displays a list of commands that can be used.");
				System.out.println("Look: Displays a long description of the Agent's current location.");
				System.out.println("Where: Displays a short description of the Agent's current location.");
			}
			else if(command.equalsIgnoreCase("look"))
			{
				System.out.println(agent.location.toString());
			}
			else if(command.equalsIgnoreCase("where"))
			{
				System.out.println(agent.location.toStringLong());
			}
			else if(command.equalsIgnoreCase("go"))
			{
				agent.usePortal();
			}
			else
				System.out.println("I don't understand '" + command + "'");
		}while(contin);
	}
}