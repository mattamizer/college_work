/**This is the Quadrilateral abstract class which inherits from the Shape class.*/
public abstract class Quadrilateral extends Shape{
  /**These are the Quadrilateral's member variables. They store the values for
   **the sides and the angles of the Quadrilateral.*/
    protected double side1, side2, side3, side4;
    protected double angle1, angle2, angle3, angle4;
  /**This is the constructor for the Quadrilateral class. It takes the values
   **for all the sides and angles and sets them all.*/
    public Quadrilateral(double side1, double side2, double side3, double side4, double angle1, double angle2, double angle3, double angle4){
	this.side1 = side1;
	this.side2 = side2;
	this.side3 = side3;
	this.side4 = side4;
	this.angle1 = angle1;
	this.angle2 = angle2;
	this.angle3 = angle3;
	this.angle4 = angle4;
    }
  /**This is the overridden getPerimeter method. It calculates the perimeter
   **of the Quadrilateral.
   **@return the area of the Quadrilateral.*/
    @Override
	public double getPerimeter(){
	double perimeter = side1 + side2 + side3 + side4;
	return perimeter;
    }
}
