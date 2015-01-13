/**This is the IsoscelesTriangle class. It inherits from the
 **Triangle class.*/
public class IsoscelesTriangle extends Triangle{
  /**This is the constructor for the IsoscelesTriangle
   **class. It takes the values for the sides and the base
   **as well as the values for the angles and passes them
   **to the superclass' constructor. In this case it passes
   **the values to the Triangle's constructor.*/
    public IsoscelesTriangle(double sides, double base, double angles, double angle){
	super(sides, sides, base, angles, angles, angle);
    }
}
