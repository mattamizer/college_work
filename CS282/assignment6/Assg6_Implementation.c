#include "Assg6.h" //Header File
#include <stdio.h> //Standard Header File
#include <math.h> //For sqrt() function

/* Takes a given array of data and places it in a seperate array
   sorted from lowest to highest, then returns the sorted array */
static void *sortArray(float *, int);
/* Swap the two given numbers */
static void swap(float *, float *);
/*Takes a given array of data and the count of the number of elements and
  determines the mean of all the numbers in the array, then returns it */
static float getMean(const float *array, int count);
/*Takes a given array of data and the count of the number of elements and
  determines the median of all the numbers in the array, then returns it */
static float getMedian(const float *array, int count);
/*Takes a given array of data and the count of the number of elements and
  determines the mode (if any). Returns -1 if there is no mode,
  otherwise returns the array location of the mode*/
static int getMode(const float *array, int count);
/*Takes a given array of data and the count of the elements in the array
  and determines the variance of the values */
static float getVariance(const float *array, int count);

/* displays minimum, maximum, mean, median, mode, standard deviation and
   variance */
void displayStatistics(const float *data, int count){
  if(count == 0){
    printf("There is no data to analyze.\n");
    return;
  }
  float sortedArray[count-1], variance;
  int i = 0, mode;
  //Copy the data from data[] to sortedArray[]
  for(i; i < count; i++)
    *(sortedArray + i) = *(data + i);

  sortArray(sortedArray, count);

  //Begin displaying the statistics

  printf("Data Items:\n");
  for(i = 0; i < count; i++)
  printf("%.2f  ", *(data+i));
  printf("\n");//Advance output to a new line
  printf("Number of data items:  %d\n", count);
  printf("Largest data item   :  %.2f\n", *(sortedArray+(count-1)));
  printf("Smallest data item  :  %.2f\n", *(sortedArray));
  printf("Mean                :  %.2f\n", getMean(sortedArray, count));
  printf("Median              :  %.2f\n", getMedian(data, count));
  /* Mode deserves it's own little block of code as it took me a good chunk
     of my life to write it. */

  mode = getMode(sortedArray, count);
  //printf("mode = &d\n", mode);
  if(mode == -1)
    printf("No mode.\n");
  else
    printf("Mode                :  %.2f\n", *(sortedArray+mode));

  variance = getVariance(data, count);
  printf("Variance            :  %.2f\n", variance);
  printf("Standard Deviation  :  %.2f\n", sqrt(variance));
}


/* gets data items from the user and fills the array data.  The
   number of items entered is stored in *count */
void getData(float *data, int * count){
  char appendData;
  float userNum;
  if(*count != 0){
    printf("Would you like to add new data to the existing sample?(Y/N):  ");
    scanf("%c", &appendData);
    getchar();//Remove newline character from the input stream
    if(appendData == 'n' || appendData == 'N')
      *count = 0;
  }
  printf("Enter one data item after each prompt, followed by <ENTER>.\n");
  printf("Use <CTRL>+D to terminate data entry.\n");
  do{
    printf("Item #%d:  ", ((*count)+1));
    userNum = scanf("%f", &data[*count]);
    if(userNum == EOF)
      break;
    (*count)++;
  }while(*count < SIZE);
    
}

/* Swap the two given numbers */
static void swap(float *num1, float *num2){
    float temp;
    temp = *num1;
    *num1 = *num2;
    *num2 = temp;
}

/* Takes a given array of data and places it in a seperate array
   sorted from lowest to highest, then returns the sorted array */
static void *sortArray(float *sortedArray, int count){
  int i, j, minIndex;
  //Sort array in ascending order
  for(i = 0; i < count; i++){
      minIndex = i;
      for(j = i + 1; j < count; j++){
        if(*(sortedArray+j) < *(sortedArray+minIndex))
             minIndex = j;
      }
      swap(sortedArray+i, sortedArray+minIndex);
  }
}

/*Takes a given array and the count of the number of elements and
  determines the mean of all the numbers in the array */
static float getMean(const float *array, int count){
  float sum = 0;
  int i = 0;
  for(i; i < count; i++)
    sum += *(array+i);
  return sum/count;
}

/*Takes a given array of data and the count of the number of elements and
  determines the median of all the numbers in the array */
static float getMedian(const float *array, int count){
  if(count % 2 == 0)
    return ((*(array + (count/2)) + *(array + ((count/2)-1)))/2);
  else
    return (*(array + (count/2)));
}

/*Takes a given array of data and the count of the number of elements and
  determines the mode (if any). Returns -1 if there is no mode,
  otherwise returns the array location of the mode*/
static int getMode(const float *array, int count){
  int freqArray[count-1];
  int i = 0, j, k, frequency = 1, maxVal = 0,  modeLoc = -1;
  int hasMode = false;
  //populate the freqArray with 1's
  for(i; i < count; i++)
    *(freqArray+i) = 1;
  //Check array for the frequency of numbers
  for(i = 0; i < count; i++){
    if((i+1) > count)
      break;
    if(array[i] == array[i+1]){
      frequency++;
    }
    else{
      *(freqArray+i) = frequency;
      frequency = 1;
    }
  }
  //Check for the highest frequency number
  for(j = 0; j < count; j++){
    //printf("I'm in the high freq test loop.\n");
    if((j+1) > count)
      break;
    if(freqArray[j] > freqArray[j+1]){
      //printf("Things should change here.\n");
      maxVal = *(freqArray+j);
      hasMode = true;
      modeLoc = j;
    }
  }
  
  //Check for repeats of the highest frequency
  for(k = 0; k < count; k++){
    //printf("High repeat check loop.\n");
    if(maxVal == freqArray[k])
      modeLoc = -1;
  }
  //printf("maxVal = %d. modeLoc = %d.\n", maxVal, modeLoc);
  //Check if there is a mode or not
  if(hasMode == false)
    modeLoc = -1;

  //Return the location of the mode if it exists, otherwise return -1
  return modeLoc;
}

/*Takes a given array of data and the count of the elements in the array
  and determines the variance of the values */
static float getVariance(const float *array, int count){
  float mean = getMean(array, count), sum = 0;
  int i = 0;
  for(i; i < count; i++){
    sum += (array[i] - mean) * (array[i] - mean);
  }
  return sum / count;
}
