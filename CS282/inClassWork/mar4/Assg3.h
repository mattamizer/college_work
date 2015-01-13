#ifndef ASSG3_H
#define ASSG3_H

void writePattern(char, char, char, char, char, int,  int,  int,  int,  int,  int);
/* writes a line consisting of n1 copies of c1, n2 copies of c2, n3
   copies of c3, n4 copies of c5 and n5 copies of c5 - but the total
   length of the line is not to exceed length.  If more than length
   characters have been requested, writePattern silently truncates
   the line.
 
   counts down from ni and length as it writes characters, taking
   advantage of the fact that these are copies of the original values
   and hence can be changed freely without affecting their values
   in the calling program.
 */
#endif
