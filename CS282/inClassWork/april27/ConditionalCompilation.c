/* Example to illustrate conditional compilation */

#include <stdio.h>
#include <stdlib.h>

#define ACME
#define DEBUG 1
struct statement {
    char name[30];
#if defined(ACME)
    char account[10];
#else
    char department[20];
#endif
    float balance;
    struct {
#ifdef ACME
	char tCode[10];
#elif DEBUG
	int tCode;
#else
	float tCode;
#endif
	int quantity;
	float price;
    } transactions[10];
};

/*	function prototypes    */
int getCustomer(struct statement *cust);
void writeToFile(struct statement *cust, FILE *fp);

int getCustomer(struct statement *cust)  {
   char buf[80];

   printf("\nEnter customer name: ");
   if (fgets(cust -> name, 30, stdin) == NULL) return 0;
#ifndef ACME
      printf("Enter customer department name: ");
      fgets(cust -> department, 20, stdin);
#else
      printf("Enter customer account number: ");
      fgets(cust -> account, 10, stdin);
#endif

      printf("Please enter the customer balance as a float number: ");
      fgets(buf, 80, stdin);
      cust -> balance = (float )atof(buf);
#ifdef ACME
      printf("Enter tCode as a character string: ");
      fgets(cust -> transactions[0].tCode, 10, stdin);
#elif !defined(DEBUG)
      printf("Enter tCode as a float: ");
      fgets(buf, 80, stdin);
      cust -> transactions [0].tCode = (float )atof(buf);
#else
      printf("Enter tCode as an integer: ");
      fgets(buf, 80, stdin);
      cust -> transactions[0].tCode = atoi(buf);
#endif

      printf("Please enter the quantity as an integer: ");
      fgets(buf, 80, stdin);
      cust -> transactions[0].quantity = atoi(buf);

      printf("Please enter the price as a float: ");
      fgets(buf, 80, stdin);
      cust -> transactions [0].price = (float )atof(buf);
      return 1;
}

void writeToFile(struct statement *cust, FILE *fp)  {
     fprintf(fp, "Name: %s", cust -> name);

#if !defined(ACME)
     fprintf(fp, "Department name: %s", cust -> department);
#else
     fprintf(fp, "Account number: %s", cust	-> account);
#endif
     fprintf(fp, "Balance: %6.2f\n", cust -> balance);
#if defined(ACME)
     fprintf(fp, "tCode: %s", cust -> transactions[0].tCode);
#elif DEBUG
     fprintf(fp, "tCode: %d\n", cust -> transactions[0].tCode);
#else
     fprintf(fp, "tCode: %6.2f\n", cust -> transactions[0].tCode);
#endif
     fprintf(fp, "Quantity: %d\n", cust -> transactions[0].quantity);
     fprintf(fp, "Price: %6.2f\n\n", cust -> transactions[0].price);
}

int main()  {
    struct statement customer;
    FILE *fp;

    if ( (fp = fopen("ConditionalCompilation_Output.txt", "wt")) == NULL) {
	perror("File opening error");
	/* void perror(const char *s)
   	   prints an error message associated with errno on stderr.
           First, the string s is printed, followed by a colon and
           a space.  Then the associated error message is printed,
           followed by a newline.  */
	exit(1);
    }
    fprintf (fp, "Sizeof customer is %d\n", sizeof(customer));
    fprintf (fp, "size of int is %d and sizeof float is %d\n\n",
                  sizeof(int), sizeof (float ) );

    printf("Enter your customer transactions now.\n");
    printf("Signal EOF when you are done.\n");

    while (getCustomer(&customer) )
	writeToFile(&customer, fp);

    printf("Thank you, the statements will be prepared\n");
    fclose(fp);
    return 0;
}

/*  The same output is obtained when run in UBUNTU and gcc under Windows
[aparna@localhost Source]$ ./a.out
Enter your customer transactions now.
Signal EOF when you are done.

Enter customer name: John Doe
Enter customer account number: 12345
Please enter the customer balance as a float number: 123.45
Enter tCode as a character string: AAA
Please enter the quantity as an integer: 1000
Please enter the price as a float: 249.95

Enter customer name: Jane Smith
Enter customer account number: 67890
Please enter the customer balance as a float number: 678.90
Enter tCode as a character string: ZZZ
Please enter the quantity as an integer: 500
Please enter the price as a float: 49.99

Enter customer name: Thank you, the statements will be prepared
[aparna@localhost Source]$
*/

/*  THIS IS THE OUTPUT FILE
Sizeof customer is 244
size of int is 4 and sizeof float is 4

Name: John Doe
Account number: 12345
Balance: 123.45
tCode: AAA
Quantity: 1000
Price: 249.95

Name: Jane Smith
Account number: 67890
Balance: 678.90
tCode: ZZZ
Quantity: 500
Price:  49.99
*/
