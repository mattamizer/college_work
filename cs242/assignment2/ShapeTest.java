

public class ShapeTest {

  public static void printShape(Shape shape) {
    System.out.println(shape.getClass() +
                       " area = " + shape.getArea() +
                       " perimeter = " + shape.getPerimeter());
  }

  public static void main(String[] args) {
    Parallelogram parallelogram = new Parallelogram(2.0, 3.0,
        Math.toRadians(45.0), Math.toRadians(135.0));
    printShape(parallelogram);
    Rectangle rectangle = new Rectangle(2.0,3.0);
    printShape(rectangle);
    Rhombus rhombus = new Rhombus(2.0, Math.toRadians(45.0),
                                  Math.toRadians(135.0));
    printShape(rhombus);
    Square square = new Square(2.0);
    printShape(square);
    Ellipse ellipse = new Ellipse(2.0, 3.0);
    printShape(ellipse);
    Circle circle = new Circle(2.0);
    printShape(circle);
    Triangle triangle = new Triangle(1.0, 1.0, 1.0,
                                     Math.toRadians(45.0),
                                     Math.toRadians(45.0),
                                     Math.toRadians(90.0));
    printShape(triangle);
    RightTriangle right = new RightTriangle(2.0, 3.0, 4.0,
                                            Math.toRadians(45.0),
                                            Math.toRadians(45.0));
    printShape(right);
    IsoscelesTriangle isosceles = new IsoscelesTriangle(2.0, 3.0,
        Math.toRadians(45.0),
        Math.toRadians(135.0));
    printShape(isosceles);
    EquilateralTriangle equilateral =
        new EquilateralTriangle(2.0, Math.toRadians(60.0));
    printShape(equilateral);

  }
}
