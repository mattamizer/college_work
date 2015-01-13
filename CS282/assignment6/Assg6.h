/* This is the header file for Assg #6 */

#ifndef ASSG6_H
#define ASSG6_H

#define true 1
#define false 0
#define SIZE 200

/* displays minimum, maximum, mean, median, mode, standard deviation and
   variance */
void displayStatistics(const float *data, int count);


/* gets data items from the user and fills the array data.  The
   number of items entered is stored in *count */
void getData(float *data, int * count);

#endif
