/**This is the Square class. It inherits from the Rhombus class*/
public class Square extends Rhombus{
  /**This is the constructor for the Square class. It
   **take the length of the sides and passes the information
   **up to the superclass' constructor. In this case, the
   **values will be passed to the Rhombus constructor*/
    public Square(double side){
	super(side, Math.toRadians(90.0), Math.toRadians(90.0));
    }
}
