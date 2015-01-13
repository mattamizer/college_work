/*  Example in pointer arithmetic or address arithmetic
    PointerArithmetic.c

    Let us say that p is of type int *
    p + 1 is an example of pointer arithmetic
    p + 1 is the address of the next integer and
    p-1 is the address of the previous integer.

    If q is of type double *, then q + 1 is the
    address of the next double and q -1 is the
    address of the previous double.
 */

 #include <stdio.h>

 int main() {
    int i, *pi = &i;;
    double d, *pd = &d, *qd;
    char ch, *pc = &ch, *qc;
    long aLong, *pl = &aLong, *ql;

    printf("An int occupies %d bytes in this system\n", sizeof(int));

    printf("A char occupies %d byte in this system\n", sizeof(char));

    printf("A double occupies %d bytes in this system\n", sizeof(double));

    printf("A float occupies %d bytes in this system\n", sizeof(float));

    printf("A long occupies %d bytes in this system\n\n", sizeof(long));

    printf("The address of i is %u\n", (unsigned) &i);
    printf("It better be the same as contents of pi which is %u\n\n", (unsigned)pi);

    printf("The address of d is %u\n", (unsigned) &d);
    printf("It better be the same as contents of pd which is %u\n\n", (unsigned)pd);

    printf("The address of ch is %u\n", (unsigned) &ch);
    printf("It better be the same as contents of pc which is %u\n\n", (unsigned)pc);

    printf("The address of aLong is %u\n", (unsigned) &aLong);
    printf("It better be the same as contents of pl which is %u\n\n", (unsigned)pl);

    /* Now let us do some pointer arithmetic */

    printf("Value of pi is %u; pi + 1 is %u;  pi + 2 is %u;\n",
                 (unsigned)pi, (unsigned)(pi + 1), (unsigned)(pi + 2) );
    printf("pi - 1 is %u; and pi - 2 is %u\n\n",
                 (unsigned)(pi - 1), (unsigned)(pi - 2));


    printf("Value of pd is %u; pd + 1 is %u;  pd + 2 is %u;\n",
	             (unsigned)pd, (unsigned)(pd + 1), (unsigned)(pd + 2) );
    printf("pd - 1 is %u; and pd - 2 is %u\n\n",
                 (unsigned)(pd - 1), (unsigned)(pd - 2));


    printf("Value of pc is %u; pc + 1 is %u;  pc + 2 is %u;\n",
		         (unsigned)pc, (unsigned)(pc + 1), (unsigned)(pc + 2) );
    printf("pc - 1 is %u; and pc - 2 is %u\n\n",
                 (unsigned)(pc - 1), (unsigned)(pc - 2));


    printf("Value of pl is %u; pl + 1 is %u;  pl + 2 is %u;\n",
			     (unsigned)pl, (unsigned)(pl + 1), (unsigned)(pl + 2) );
    printf("pl - 1 is %u; and pl - 2 is %u\n\n",
                 (unsigned)(pl - 1), (unsigned)(pl - 2));

    qd = pd + 7;
    printf("\nThe value of pd is %u and value of qd (which is pd+7) is %u\n",
                    (unsigned)pd, (unsigned)qd);
    printf("The value of qd - pd is %d\n", qd - pd);
    printf("qd is %d bytes ahead of pd\n", (unsigned)qd -(unsigned)pd);
    printf("The value of pd - qd is %d\n", pd - qd);
    printf("And pd is %d bytes behind qd\n\n", (unsigned)qd -(unsigned)pd );
    
    qc = pc + 20;
    printf("The value of pc is %u and value of qc (which is pc+20) is %u\n",
                  (unsigned)pc, (unsigned)qc);
    printf("The value of qc - pc is %d\n", qc - pc);
    printf("qc is %d bytes ahead of pc\n", (unsigned)qc -(unsigned)pc);
    printf("The value of pc - qc is %d\n", pc - qc);
    printf("And pc is %d bytes behind qc\n\n", (unsigned)qc -(unsigned)pc );

    ql = pl + 10;
    printf("The value of pl is %u and value of ql (which is pl+10) is %u\n",
                  (unsigned)pl, (unsigned)ql);
    printf("The value of ql - pl is %d\n", ql - pl);
    printf("ql is %d bytes ahead of pl\n", (unsigned)ql -(unsigned)pl);
    printf("The value of pl - ql is %d\n", pl - ql);
    printf("And pl is %d bytes behind ql\n\n", (unsigned)ql -(unsigned)pl );

    return 0;
}

/*  This is the output I got when I ran this program in Windows XP
An int occupies 4 bytes in this system
A char occupies 1 byte in this system
A double occupies 8 bytes in this system
A float occupies 4 bytes in this system
A long occupies 4 bytes in this system

The address of i is 2293620
It better be the same as contents of pi which is 2293620

The address of d is 2293608
It better be the same as contents of pd which is 2293608

The address of ch is 2293599
It better be the same as contents of pc which is 2293599

The address of aLong is 2293584
It better be the same as contents of pl which is 2293584

Value of pi is 2293620; pi + 1 is 2293624;  pi + 2 is 2293628;
pi - 1 is 2293616; and pi - 2 is 2293612

Value of pd is 2293608; pd + 1 is 2293616;  pd + 2 is 2293624;
pd - 1 is 2293600; and pd - 2 is 2293592

Value of pc is 2293599; pc + 1 is 2293600;  pc + 2 is 2293601;
pc - 1 is 2293598; and pc - 2 is 2293597

Value of pl is 2293584; pl + 1 is 2293588;  pl + 2 is 2293592;
pl - 1 is 2293580; and pl - 2 is 2293576


The value of pd is 2293608 and value of qd (which is pd+7) is 2293664
The value of qd - pd is 7
qd is 56 bytes ahead of pd
The value of pd - qd is -7
And pd is 56 bytes behind qd

The value of pc is 2293599 and value of qc (which is pc+20) is 2293619
The value of qc - pc is 20
qc is 20 bytes ahead of pc
The value of pc - qc is -20
And pc is 20 bytes behind qc

The value of pl is 2293584 and value of ql (which is pl+10) is 2293624
The value of ql - pl is 10
ql is 40 bytes ahead of pl
The value of pl - ql is -10
And pl is 40 bytes behind ql
*/

/* this is the output I got when run on Ubuntu on the same machine
aparna@aparna-laptop:~/Documents/CS282$ gcc PointerArithmetic.c
aparna@aparna-laptop:~/Documents/CS282$ ./a.out
An int occupies 4 bytes in this system
A char occupies 1 byte in this system
A double occupies 8 bytes in this system
A float occupies 4 bytes in this system
A long occupies 4 bytes in this system

The address of i is 3215863688
It better be the same as contents of pi which is 3215863688

The address of d is 3215863648
It better be the same as contents of pd which is 3215863648

The address of ch is 3215863695
It better be the same as contents of pc which is 3215863695

The address of aLong is 3215863664
It better be the same as contents of pl which is 3215863664

Value of pi is 3215863688; pi + 1 is 3215863692;  pi + 2 is 3215863696;
pi - 1 is 3215863684; and pi - 2 is 3215863680

Value of pd is 3215863648; pd + 1 is 3215863656;  pd + 2 is 3215863664;
pd - 1 is 3215863640; and pd - 2 is 3215863632

Value of pc is 3215863695; pc + 1 is 3215863696;  pc + 2 is 3215863697;
pc - 1 is 3215863694; and pc - 2 is 3215863693

Value of pl is 3215863664; pl + 1 is 3215863668;  pl + 2 is 3215863672;
pl - 1 is 3215863660; and pl - 2 is 3215863656


The value of pd is 3215863648 and value of qd (which is pd+7) is 3215863704
The value of qd - pd is 7
qd is 56 bytes ahead of pd
The value of pd - qd is -7
And pd is 56 bytes behind qd

The value of pc is 3215863695 and value of qc (which is pc+20) is 3215863715
The value of qc - pc is 20
qc is 20 bytes ahead of pc
The value of pc - qc is -20
And pc is 20 bytes behind qc

The value of pl is 3215863664 and value of ql (which is pl+10) is 3215863704
The value of ql - pl is 10
ql is 40 bytes ahead of pl
The value of pl - ql is -10
And pl is 40 bytes behind ql
*/











