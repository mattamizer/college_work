/**This is the Rhombus class which inherits from the Parallelogram class*/
public class Rhombus extends Parallelogram{
  /**This is the constructor for the Rhombus class. It takes the values
   **for the side lenght and the angles and passes them to the
   **superclass' constructor. In this case the values are passes to the
   **Parallelogram's constructor.*/
    public Rhombus(double side, double angle1, double angle2){
	super(side, side, angle1, angle2);
    }
}
