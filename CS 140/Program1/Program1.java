/**
 * @(#)Text1.java
 *
 *
 * @author 
 * @version 1.00 2009/2/2
 */
import java.util.Scanner;

public class Program1
{


    public static void main(String[] args) 
    {
    	System.out.println("Hello out there");
    	System.out.println("I will add two numbers for you");
    	System.out.println("Enter two whole numbers on a line");
    	int n1, n2, n3;
    	Scanner kbd = new Scanner(System.in);
    	n1 = kbd.nextInt();
    	n2 = kbd.nextInt();
    	n3 = n1 + n2;
    	System.out.print("The sum of those two numbers is ");
    	System.out.println(n3);
    }
    
    
}