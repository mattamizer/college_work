/**@author Matthew Morrissey
 **@version 1.0
 **Student Class. Assigns a unique ID number to each Student instance
 **and generates a random name for the same Student.*/



public class Student{
    private int studentID;
    private static int x = 1;
    /**Constructor for the Student*/
    public Student(){
	//TODO Enter code for random name generation
	studentID = x++;
    }
    /**toString method. Returns @return*/
    public String toString(){
	return "Student " + studentID;
    }
}