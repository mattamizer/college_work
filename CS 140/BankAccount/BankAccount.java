/**
 * Matthew Morrissey
 * CS140
 * BankAccount
 *
 * Class for creating instances of bank accounts
 */

import java.text.NumberFormat;

public class BankAccount 
{
	private int accountNumber = 0;
	private double accountBalance = 0.0;
	public int getAccountNumber()
	{
		return accountNumber;
	}
	public String getAccountBalance()
	{
		NumberFormat currency = NumberFormat.getCurrencyInstance();
		String balanceString = currency.format(accountBalance);
		return balanceString;
	}
	public void setAccountNumber(int accountNum)
	{
		if(accountNumber != 0)//Check if account already exists.
		{
			System.out.println("Account already exists.");
		}
		else if(accountNum > 0)
		{
			accountNumber = accountNum;
		}
	}
	public void deposit(double amount)
	{
		if(amount < 0)//Check that deposit amount is a positive number.
		{
			System.out.println("Cannot deposit $" + amount + "0 into account " + accountNumber);
		}
		else
		{
			accountBalance += amount;
			NumberFormat currency = NumberFormat.getCurrencyInstance();
			String amountString = currency.format(amount);
			System.out.println("Deposited " + amountString + " into account " + accountNumber);
		}
	}
	public void withdraw(double amount)
	{
		if(amount < 0)//Check that withdraw amount is a positive number.
		{
			System.out.println("Cannot withdraw a negative amount of money.");
		}
		else if(amount > accountBalance)//Check that the withdrawal amount is less than the balance.
		{
			NumberFormat currency = NumberFormat.getCurrencyInstance();
			String amountString = currency.format(amount);
			NumberFormat balCurrency = NumberFormat.getCurrencyInstance();
			String balanceString = balCurrency.format(accountBalance);
			System.out.println("Insufficient funds. Cannot withdraw " + amountString + " from account " + accountNumber + ". Balance = " + balanceString + ".");
		}
		else
		{
			accountBalance -= amount;
			NumberFormat currency = NumberFormat.getCurrencyInstance();
			String amountString = currency.format(amount);
			NumberFormat balCurrency = NumberFormat.getCurrencyInstance();
			String balanceString = balCurrency.format(accountBalance);
			System.out.println("Withdrew " + amountString + " from account " + accountNumber + ". Remaining balance = " + balanceString + ".");
		}
	}
	public void show()
	{
		NumberFormat currency = NumberFormat.getCurrencyInstance();
		String balanceString = currency.format(accountBalance);
		System.out.println("Account " + accountNumber + " contains " + balanceString + ".");
	}
}