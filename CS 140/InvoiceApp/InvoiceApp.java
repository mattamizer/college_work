/*Matthew Morrissey
 *February 9, 2009
 *CS 140 Section 1
 *InvoiceApp: Calculate invoicing amounts*/
import java.text.NumberFormat;
import java.util.Scanner;

public class InvoiceApp
{
	public static void main(String[] args)
	{
		Scanner sc = new Scanner(System.in);
		String choice = "y";
		while(!choice.equalsIgnoreCase("n"))
		{
			//Get the input from the user
			System.out.print("Enter customer type (r/c/t): ");
			String customerType = sc.next();
			System.out.print("Enter subtotal: ");
			double subtotal = sc.nextDouble();
			//Get the discount percent
			double discountPercent = 0.0;
			//This outer if/else ladder checks the customer type
			if(customerType.equalsIgnoreCase("r"))
			{
				//This inner if/else ladder checks the subtotal amount
				if(subtotal < 100.0)
				{
					discountPercent = 0.0;
				}
				else if(subtotal >= 100.0 && subtotal < 250)
				{
					discountPercent = 0.1;
				}
				else if(subtotal >= 250 && subtotal < 500)
				{
					discountPercent = 0.25;
				}
				else if(subtotal >= 500)
				{
					discountPercent = 0.3;
				}
			}
			else if(customerType.equalsIgnoreCase("c"))
			{
				discountPercent = 0.2;
			}
			else if(customerType.equalsIgnoreCase("t"))
			{
				if(subtotal < 500)
				{
					discountPercent = 0.4;
				}
				else if(subtotal >= 500)
				{
					discountPercent = 0.5;
				}
			}
			//Code to calculate, format, and display the results
			NumberFormat disPercent = NumberFormat.getPercentInstance();
			String percentDisplay = disPercent.format(discountPercent);
			System.out.println("Discount percent: " + percentDisplay);
			double discountAmount = subtotal * discountPercent;
			NumberFormat discount = NumberFormat.getCurrencyInstance();
			String discountDisplay = discount.format(discountAmount);
			System.out.println("Discount amount: " + discountDisplay);
			double total = subtotal - discountAmount;
			NumberFormat totAmount = NumberFormat.getCurrencyInstance();
			String totalDisplay = totAmount.format(total);
			System.out.println("Total: " + totalDisplay);
			System.out.print("Would you like to continue? (y/n): ");
			choice = sc.next();
		}
	}
}