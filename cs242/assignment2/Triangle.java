/**This is the Triangle class. It inherits from the Shape class.*/

import java.lang.Math;

public class Triangle extends Shape{
  /**These are the member variables associated with the
   **Triangle class. There are variables for each of the
   **sides and each of the angles.*/
  protected double side1, side2, side3;
  protected double angle1, angle2, angle3;
  /**This is the constructor for the Triangle class. It
   **takes the values for all the sides and angles and
   **sets them to their proper values.*/
  public Triangle(double side1, double side2, double side3, double angle1, double angle2, double angle3){
	this.side1 = side1;
	this.side2 = side2;
	this.side3 = side3;
	this.angle1 = angle1;
	this.angle2 = angle2;
	this.angle3 = angle3;
    }
  /**This is the overriden getArea method inherited from
   **the Shape class. It calculates the area of the Triangle.
   **@return the Triangle's area.*/
    @Override
	public double getArea(){
	double area = 0.5 * Math.sin(angle1) * side1 * side3;
	return area;
    }
  /**This is the overridden getPerimeter method inherited
   **from the Shape class. It calculates the perimeter of
   **the Triangle.
   **@return the Triangle's perimeter.*/
    @Override
	public double getPerimeter(){
	double perimeter = side1 + side2 + side3;
	return perimeter;
    }
}
