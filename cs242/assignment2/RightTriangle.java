/**This is the RightTriangle class. It inherits from the Triangle
 **class.*/
public class RightTriangle extends Triangle{
  /**This is the constructor for RightTriangle. It takes
   **the values for the three sides and two of its angles
   **and passes the values to the superclass' constructor.
   **In this case, the values are passed to the Triangle's
   **constructor.*/  
  public RightTriangle(double side1, double side2, double side3, double angle1, double angle2){
	super(side1, side2, side3, angle1, angle2, Math.toRadians(90.0));
    }
}
