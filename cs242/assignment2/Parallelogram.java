/**This is the Parallelogram class. It inherits from the Quadrilateral
 **class.*/
import java.lang.Math;

public class Parallelogram extends Quadrilateral{
  /**This is the constructor for the Parallelogram class. It
   **takes the values for the length and width and for the angles
   **and passes them to the superclass' constructor. It this case,
   **the values are passed to the Quadrilateral's constructor.*/
    public Parallelogram(double length, double width, double angle1, double angle2){
	super(length, width, length, width, angle1, angle2, angle1, angle2);
    }
  /**This is the overridden getArea method which finds the area of
   **the parallelogram.
   **@return the area of the parallelogram.*/
    @Override
	public double getArea(){
	double area = Math.sin(this.angle1) * this.side1 * this.side2;
	return area;
    }
}
