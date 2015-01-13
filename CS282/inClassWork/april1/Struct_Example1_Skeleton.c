/* Example in structures */

#include <stdio.h>      /* standard header file*/
#include <string.h>     /* for strcpy() */
#include <stdlib.h>     /* for malloc(), atoi() and atof() */
#include <assert.h>     /* for assert() macro */

typedef struct person1 {
   char *firstName;
   char *lastName;
   int age;
   double weeklyPay;
} PERSON1;

typedef struct person2 {
   char firstName[20];
   char lastName[20];
   int age;
   double weeklyPay;
} PERSON2;

/* function prototypes */
void fillInfo1(PERSON1 *);
void fillInfo2(PERSON2 *);
void printInfo1(PERSON1);
void printInfo2(const PERSON2 *);

int main()  {
   PERSON1 p1, temp1;
   PERSON2 p2, temp2;

   printf("Sizeof int is %d, Size of double is %d and Sizeof p1 is %d\n",
		  sizeof(int), sizeof(double), sizeof(p1) );
   printf("Sizeof char * is %d and Sizeof p2 is %d\n",
                  sizeof(char *), sizeof(p2) );

   fillInfo1(&p1);
   fillInfo2(&p2);

   temp1 = p1;
   temp2 = p2;

   printf("\n");
   printInfo1(p1);
   printInfo1(temp1);

   printInfo2(&p2);
   printInfo2(&temp2);

   return 0;
}

void fillInfo1(PERSON1 *p)  {
/* fills in the structure fileds */
   char buf[80], *ptr;

   printf("\nPlease enter first name: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> firstName = (char *)malloc(strlen(buf)+1);
   assert(p -> firstName != NULL);
   strcpy(p -> firstName, buf);

   printf("Please enter last name: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> lastName = (char *)malloc(strlen(buf)+1);
   assert(p -> lastName != NULL);
   strcpy(p -> lastName, buf);

   printf("Please enter age: " );
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> age = atoi(buf);

   printf("Please enter weeklyPay: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> weeklyPay = atof(buf);
}

void fillInfo2(PERSON2 *p)  {
/* fills in the structure fileds */
   char buf[80], *ptr;

   printf("\nPlease enter first name: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   strcpy(p -> firstName, buf);

   printf("Please enter last name: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   strcpy(p -> lastName, buf);

   printf("Please enter age: " );
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> age = atoi(buf);

   printf("Please enter weeklyPay: ");
   fgets(buf, 80, stdin);
   ptr = strchr(buf, '\n');
   if(ptr != NULL)
     *ptr = '\0';
   p -> weeklyPay = atof(buf);
}

void printInfo1(PERSON1 p)  {
   printf("First Name:   %s\n", p.firstName);
   printf("Last Name:    %s\n", p.lastName);
   printf("Age:          %d\n", p.age);
   printf("Weekly Pay:  $%.2f\n\n", p.weeklyPay);
}
void printInfo2(const PERSON2 *p)  {
   printf("First Name:   %s\n", p -> firstName);
   printf("Last Name:    %s\n", p -> lastName);
   printf("Age:          %d\n", p -> age);
   printf("Weekly Pay:  $%.2f\n\n", p -> weeklyPay);
   /* p -> age = 20; */
   /* Struct_Example1.c: In function printInfo2:
      Struct_Example1.c:115: error: assignment of read-only location
    */
}

/*  This is the output of the program run in my laptop at home
[aparna@localhost Source]$ ./a.out
Sizeof int is 4, Size of double is 8 and Sizeof p1 is 20
Sizeof char * is 4 and Sizeof p2 is 52

Please enter first name: John
Please enter last name: Doe
Please enter age: 34
Please enter weeklyPay: 780

Please enter first name: Jane
Please enter last name: Smith
Please enter age: 37
Please enter weeklyPay: 840

First Name:   John
Last Name:    Doe
Age:          34
Weekly Pay:   780.00

First Name:   John
Last Name:    Doe
Age:          34
Weekly Pay:   780.00

First Name:   Jane
Last Name:    Smith
Age:          37
Weekly Pay:   840.00

First Name:   Jane
Last Name:    Smith
Age:          37
Weekly Pay:   840.00

[aparna@localhost Source]$
*/

/* This is the output of the program run in my laptop at work:
[aparna@localhost Source]$ gcc Struct_Example1.c
[aparna@localhost Source]$ ./a.out
Sizeof int is 4, Size of double is 8 and Sizeof p1 is 32
Sizeof char * is 8 and Sizeof p2 is 56

Please enter first name: John
Please enter last name: Doe
Please enter age: 34
Please enter weeklyPay: 450

Please enter first name: Janet
Please enter last name: Smith
Please enter age: 23
Please enter weeklyPay: 800

First Name:   John
Last Name:    Doe
Age:          34
Weekly Pay:   450.00

First Name:   John
Last Name:    Doe
Age:          34
Weekly Pay:   450.00

First Name:   Janet
Last Name:    Smith
Age:          23
Weekly Pay:   800.00

First Name:   Janet
Last Name:    Smith
Age:          23
Weekly Pay:   800.00

[aparna@localhost Source]$
*/
