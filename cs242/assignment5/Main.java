/**@author Matthew Morrissey
 **@version 1.0
 **This class runs the virtual machine with the given instructions*/
public class Main{
    public static void main(String[] args){
	Machine m = new Machine();
	Identifier x = new Identifier("x");
	m.pushExpr(new Repeat(x, 10, new Print(x)));
	System.out.println(m);
	m.run();
	System.out.println(m);

    }
}