/**
 * Matthew Morrissey
 * February 2, 2008
 * CS140
 * Conversions: Convert between miles and other lengths
 */
import java.util.Scanner;

public class Convert {

    public static void main(String[] args) {
    	double miles, kilometers, yards, feet, inches, centimeters;
    	Scanner userIn = new Scanner(System.in);
    	System.out.print("How many miles?   ");
    	miles = userIn.nextDouble(); //Get input from the user.
    	kilometers = miles * 1.609344; //Do the conversions.
    	yards = miles * 1760;
    	feet = miles * 5280;
    	inches = miles * 63360;
    	centimeters = miles * 160934.4;
    	System.out.println("Kilometers: " + kilometers); //Output the results of the conversions.
    	System.out.println("Yards: " + yards);
    	System.out.println("Feet: " + feet);
    	System.out.println("Inches: " + inches);
    	System.out.println("Centimeters: " + centimeters);
    }
    
    
}