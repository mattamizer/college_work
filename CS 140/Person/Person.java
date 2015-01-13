/**
 * Person.java
 *
 *
 * Matthew Morrissey
 * CS 140 
 * @version 1.00 2009/4/27
 */

import java.util.Scanner;

public class Person
{
	private String lastName;
	private int socialSecurityNumber;
	private String streetAddress;
	private String homeTown;
	private int age;
	
	public void readFromScanner(Scanner sc)
	{
		try
		{
			lastName = sc.nextLine();
			socialSecurityNumber = sc.nextInt();
			streetAddress = sc.nextLine();
			homeTown = sc.nextLine();
			age = sc.nextInt();
		}
		catch(Exception exn)
		{
			throw new RuntimeException("Premature end of input file");
		}
	}
}