/**This is the Rectangle class which inherits from the Parallelogram class.*/
public class Rectangle extends Parallelogram{
  /**This is the constructor for the Rectangle class. It takes the values
   **of the length and width and passes them to the superclass' constructor.
   **In this case the values are passed to the Parallelogram's constructor.*/
    public Rectangle(double length, double width){
	super(length, width, Math.toRadians(90.0), Math.toRadians(90.0));
    }
}
