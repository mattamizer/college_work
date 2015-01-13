/**This is the Ellipse class which inherits from the Shape class.*/
import java.lang.Math;

public class Ellipse extends Shape{
  /**These are the member varaibles for storing the axis of the Ellipse*/
    protected double axis1, axis2;
  /**This is the constructor for the Ellipse class. It sets the values
   **of the axis.*/
    public Ellipse(double axis1, double axis2){
	this.axis1 = axis1;
	this.axis2 = axis2;
    }
  /**This is the overridden getArea method. It calculates the area of the
   **Ellipse.
   **@return the area of the Ellipse.*/
    @Override
	public double getArea(){
	double area = Math.PI * axis1 * axis2;
	return area;
    }
  /**This is the overridden getPerimeter method. It calculates the perimeter
   **of the Ellipse.
   **@return the perimeter of the Ellipse.*/
    @Override
	public double getPerimeter(){
      double perimeter = 2 * (Math.PI * Math.sqrt(0.5 * (Math.pow(axis1, 2.0) + Math.pow(axis2, 2.0))));
	return perimeter;
    }
}
