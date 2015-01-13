/*
 * A macro consists of source code. A macro is like a function in that the
 * macro code is defined and associated with an identifier. Calling a macro
 * is much like calling a function; it consists of placing the name of the
 * macro in the source code accompanied with the actual parameters in a
 * comma-separated list enclosed in parentheses.
 *
 * A macro differs from a function in that when a program has been translated
 * to object code, the code for the macro is expanded in every place where the
 * macro was called, while the code for a function remains in a separate
 * location in memory. Executing a function requires transferring control to
 * a separate part of the object code in memory and transferring control back
 * after execution is finished. There is other overhead in setting up and
 * removing the execution environment for the function. In contrast the
 * code for macro is expanded at the position of the call, and thus
 * avoids the transfer of control and the overhead. In general, macros
 * execute faster than functions, but take up more memory if they are called
 * often.
 */

/* The following are some examples of macros */

#include <stdio.h>

#define printit printf("it");
/* NOTE: printit; will translate into printf("it");; (two semicolons) */

#define print(s)  printf("current value is %d\n", s);

#define pr(s)  printf("value is %d\n", \
                                       s);
/* if a macro has to go beyond one line use the \ character at the end of
 * each line */

#define max(x,y) x > y ? x:y

#define isLetter(c) ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) ? 1 : 0

int main()  {
   int counter = 5;

   char ch = 'h';

   printit;

   printf("\n");

   print(counter);

   pr(counter);

   printf("max of ch and counter is %d\n", max(counter, ch));

   if (isLetter(ch))
      printf("%c is a letter\n", ch);

   return 0;
}
