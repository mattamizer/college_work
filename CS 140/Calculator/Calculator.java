/**
 *Matthew Morrissey
 *Feburary 23, 2009
 *CS 140
 *Calculator: This program obtains values from the user and computers a user seletced arithmetic solution.
 */
import java.util.Scanner;
import java.lang.Math;

public class Calculator
{

    public static void main(String[] args)
    {
    	Scanner sc = new Scanner(System.in);
    	boolean contin = true;
    	float accumulator = (float)0.0;
    	float input;
    	while(contin)
    	{
    		int choice;
    		System.out.println("Accumulator = " + accumulator);
    		System.out.println("Please choose one of the following options:");
    		System.out.println("0) Exit");
    		System.out.println("1) Addition");
    		System.out.println("2) Subtraction");
    		System.out.println("3) Multiplication");
    		System.out.println("4) Division");
    		System.out.println("5) Square Root");
    		System.out.println("6) Clear");
    		System.out.print("What is your choice? ");
    		choice = sc.nextInt();
    		if(choice == 0)
    		{
    			contin = false;
    		}
    		else if(choice == 1)
    		{
    			//Do addition
    			System.out.print("Enter a number: ");
    			input = sc.nextFloat();
    			accumulator = accumulator + input;
    		}
    		else if(choice == 2)
    		{
    			//Do subtraction
    			System.out.print("Enter a number: ");
    			input = sc.nextFloat();
    			accumulator = accumulator - input;
    		}
    		else if(choice == 3)
    		{
    			//Do multiplication
    			System.out.print("Enter a number: ");
    			input = sc.nextFloat();
    			accumulator = accumulator * input;
    		}
    		else if(choice == 4)
    		{
    			//Do division
    			System.out.print("Enter a number: ");
    			input = sc.nextFloat();
    			accumulator = accumulator / input;
    		}
    		else if(choice == 5)
    		{
    			//Do square root
    			accumulator = (float)Math.sqrt(accumulator);
    		}
    		else if(choice == 6)
    		{
    			accumulator = (float)0.0;
    		}
    		else
    		{
    			System.out.println("Illegal operation: " + choice);
    		}
    	}
    }
    
    
}