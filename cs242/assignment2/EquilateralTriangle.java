/**This is the EquilateralTriangle class. It inherits from the
 **IsoscelesTriangle class.*/
public class EquilateralTriangle extends IsoscelesTriangle{
  /**This is the constructor for EquilateralTriangle. It takes
   **the values for the sides and the angles and passes them
   **to the superclass' constructor. In this case it passes the
   **values to the IsoscelesTriangle's constructor.*/
    public EquilateralTriangle(double sides, double angles){
	super(sides, sides, angles, angles);
    }
}
