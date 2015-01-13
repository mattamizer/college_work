/*
 * Outputs results from the macros SQR1(x), SQR2(x), SQR3(x), SQR4(x)
 * and the function square(x)
 *
 * OBJECTIVE: To illustrate some of the differences between macros and
 * functions: how substitutions take place and how macros are expanded.
 */

#include <stdio.h>

#define SQR1(x)   x * x
#define SQR2(x)   (x) * (x)
#define SQR3(x)   ( (x) * (x) )

int SQR_x;
#define SQR4(x)   (SQR_x = (x), SQR_x * SQR_x)

int square(int);

int square(int x)  {
   return (x * x);
}

int main()   {
   int a = 3;

   printf("square(a) is %d\n", square(a) );
   printf("SQR1(a) is %d\n", SQR1(a) );
   printf("SQR2(a) is %d\n", SQR2(a) );
   printf("SQR3(a) is %d\n", SQR3(a) );
   printf("SQR4(a) is %d\n\n", SQR4(a) );

   printf("square(a+1) is %d\n", square(a+1) );
   printf("SQR1(a+1) is %d\n", SQR1(a+1) );
   printf("SQR2(a+1) is %d\n", SQR2(a+1) );
   printf("SQR3(a+1) is %d\n", SQR3(a+1) );
   printf("SQR4(a+1) is %d\n\n", SQR4(a+1) );

   printf("square(a++) is %d and ", square(a++) );
   printf("a is %d\n", a);

   a = 3;
   printf("SQR1(a++) is %d and ", SQR1(a++) );
   printf("a is %d\n", a);

   a = 3;
   printf("SQR2(a++) is %d and ", SQR2(a++) );
   printf("a is %d\n", a);

   a = 3;
   printf("SQR3(a++) is %d and ", SQR3(a++) );
   printf("a is %d\n", a);

   a = 3;
   printf("SQR4(a++) is %d and ", SQR4(a++) );
   printf("a is %d\n\n", a);

   printf("square(5+5) * square(5+5) is %d\n\n", square(5+5) * square(5+5) );
   printf("SQR1(5+5) * SQR1(5+5) is %d\n\n", SQR1(5+5) * SQR1(5+5) );
   printf("SQR2(5+5) * SQR2(5+5) is %d\n\n", SQR2(5+5) * SQR2(5+5) );
   printf("SQR3(5+5) * SQR3(5+5) is %d\n\n", SQR3(5+5) * SQR3(5+5) );
   printf("SQR4(5+5) * SQR4(5+5) is %d\n\n", SQR4(5+5) * SQR4(5+5) );

   printf("square(5+5) * square(5+5) / square(2+3)  is %d\n\n",
        square(5+5) * square(5+5) / square(2+3) );

   printf("SQR1(5+5) * SQR1(5+5) / SQR1(2+3) is %d\n\n",
        SQR1(5+5) * SQR1(5+5) / SQR1(2+3) );

   printf("SQR2(5+5) * SQR2(5+5) / SQR2(2+3) is %d\n\n",
        SQR2(5+5) * SQR2(5+5) / SQR2(2+3) );

   printf("SQR3(5+5) * SQR3(5+5) / SQR3(2+3) is %d\n\n",
        SQR3(5+5) * SQR3(5+5) / SQR3(2+3) );

   printf("SQR4(5+5) * SQR4(5+5) / SQR4(2+3) is %d\n\n",
        SQR4(5+5) * SQR4(5+5) / SQR4(2+3) );

   return 0;
}

/* Output when I ran the program using gcc in Windows
square(a) is 9
SQR1(a) is 9
SQR2(a) is 9
SQR3(a) is 9
SQR4(a) is 9

square(a+1) is 16
SQR1(a+1) is 7
SQR2(a+1) is 16
SQR3(a+1) is 16
SQR4(a+1) is 16

square(a++) is 9 and a is 4
SQR1(a++) is 9 and a is 5
SQR2(a++) is 9 and a is 5
SQR3(a++) is 9 and a is 5
SQR4(a++) is 9 and a is 4

square(5+5) * square(5+5) is 10000

SQR1(5+5) * SQR1(5+5) is 85

SQR2(5+5) * SQR2(5+5) is 10000

SQR3(5+5) * SQR3(5+5) is 10000

SQR4(5+5) * SQR4(5+5) is 10000

square(5+5) * square(5+5) / square(2+3)  is 400

SQR1(5+5) * SQR1(5+5) / SQR1(2+3) is 91

SQR2(5+5) * SQR2(5+5) / SQR2(2+3) is 10000

SQR3(5+5) * SQR3(5+5) / SQR3(2+3) is 400

SQR4(5+5) * SQR4(5+5) / SQR4(2+3) is 400
*/

/* Output when I ran the program using gcc in Ubuntu 
square(a) is 9
SQR1(a) is 9
SQR2(a) is 9
SQR3(a) is 9
SQR4(a) is 9

square(a+1) is 16
SQR1(a+1) is 7
SQR2(a+1) is 16
SQR3(a+1) is 16
SQR4(a+1) is 16

square(a++) is 9 and a is 4
SQR1(a++) is 9 and a is 5
SQR2(a++) is 9 and a is 5
SQR3(a++) is 9 and a is 5
SQR4(a++) is 9 and a is 4

square(5+5) * square(5+5) is 10000

SQR1(5+5) * SQR1(5+5) is 85

SQR2(5+5) * SQR2(5+5) is 10000

SQR3(5+5) * SQR3(5+5) is 10000

SQR4(5+5) * SQR4(5+5) is 10000

square(5+5) * square(5+5) / square(2+3)  is 400

SQR1(5+5) * SQR1(5+5) / SQR1(2+3) is 91

SQR2(5+5) * SQR2(5+5) / SQR2(2+3) is 10000

SQR3(5+5) * SQR3(5+5) / SQR3(2+3) is 400

SQR4(5+5) * SQR4(5+5) / SQR4(2+3) is 25
*/
