/**
 * Matthew Morrissey
 * CS140
 * Main
 *
 * Main method for creating and manipulation of BankAccount instances
 */

public class Main
{
    
    public static void main(String[] args)
    {
        BankAccount b1 = new BankAccount();
        BankAccount b2 = new BankAccount();
        b1.setAccountNumber(12340);
        b2.setAccountNumber(43210);
        b1.deposit(-20.0);
        b1.deposit(100000.0);
        b1.withdraw(1000001.0);
        b1.withdraw(-40.0);
        b1.withdraw(50000);
        b2.deposit(5000);
        b2.withdraw(300.0);
        System.out.println("The account number you requested is " + b1.getAccountNumber() + ".");
        System.out.println("The balance of this account is " + b1.getAccountBalance() + ".");
        b1.show();
        System.out.println("The account number you requested is " + b2.getAccountNumber() + ".");
        System.out.println("The balance of this account is " + b2.getAccountBalance() + ".");
        b2.show();
    }
}
