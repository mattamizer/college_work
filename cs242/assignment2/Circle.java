/**This is the Circle class which inherits from the Ellipse class.*/
public class Circle extends Ellipse{
  /**This is the constructor for the Circle class. It takes the
   **value of the radius and passes it to the superclass' constructor.
   **In this case the values are passed to the Ellipse's constructor.*/
    public Circle(double radius){
	super(radius, radius);
    }
}
