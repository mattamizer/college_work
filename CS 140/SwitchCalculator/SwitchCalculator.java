/**
 * Matthew Morrissey
 * CS140
 * March 2, 2009
 *
 * SwitchCalculator - Performs user specified arithmetic operations with user entered numbers.
 */
 
    import java.util.Scanner;
    import java.lang.Math;

public class SwitchCalculator
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
    		switch(choice)
    		{
    			case 0:
    				contin = false;
    				break;
    			case 1:
    				System.out.print("Enter a number: ");
    				input = sc.nextFloat();
    				accumulator = accumulator + input;
    				break;
    			case 2:
    				System.out.print("Enter a number: ");
    				input = sc.nextFloat();
    				accumulator = accumulator - input;
    				break;
    			case 3:
    				System.out.print("Enter a number: ");
    				input = sc.nextFloat();
    				accumulator = accumulator * input;
    				break;
    			case 4:
    				System.out.print("Enter a number: ");
    				input = sc.nextFloat();
    				accumulator = accumulator / input;
    				break;
    			case 5:
    				accumulator = (float)Math.sqrt(accumulator);
    				break;
    			case 6:
    				accumulator = (float)0.0;
    				break;
    			default:
    				System.out.println("Illegal operation: " + choice);
    		}

    	}
    }
}
