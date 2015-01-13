/**@author Matthew Morrissey
 **@version 1.0
 **This class displays expressions on the stack*/
public class Print implements Expression{
    private Object printExpr;
    /**Constructor for the Print class.
     **@param
     **an object to be pushed onto the expression stack.*/
    public Print(Object obj){
	printExpr = obj;
    }
    /**Implemented eval() method. Pushes a new Display instance and the expression to be displayed onto the expression stack.
     **@param
     **a Machine instance.*/
    public void eval(Machine machine){
	machine.pushExpr(new Display());
	machine.pushExpr(printExpr);
    }
    /**toString() method.
     **@return
     **"print (expression)"*/
    public String toString(){
	return "print " + printExpr;
    }
    /**Innter Display class*/
    private class Display implements Expression{
	/**Implemented eval() method. Prints the Object on the top of the object stack to the screen.
	 **@param
	 **a machine instance.*/
	public void eval(Machine machine){
	    System.out.println(machine.peekObj().toString());
	}
	/**toString() method.
	 **@return
	 **"Display()"*/
	public String toString(){
	    return "Display()";
	}
    }
}