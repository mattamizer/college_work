/**@author Matthew Morrissey
 **@version 1.0
 **This class allows for the virtual machine to process repeated evaluations*/
public class Repeat implements Expression{
    private Identifier identifier;
    private int limit;
    private Object expression;
    /**Contructor for the Repeat class.
     **@param
     **an Identifier instance, an integer(the number of times to repeat), and an Object expression*/
    public Repeat(Identifier identifier, int count, Object expression){
	this.identifier = identifier;
	limit = count;
	this.expression = expression;
    }
    /**Implemented eval() message. Pushes a new Loop instance onto the expression stack.
     **@param
     **a Machine instance.*/
    public void eval(Machine machine){
	machine.pushExpr(new Loop());
    }
    /**toString() method.
     **@return
     **"repeat (Identifier) (number of times) (expression)"*/
    public String toString(){
	return "repeat " + identifier.toString() + " " + limit + " " + expression.toString();
    }
    /**Inner Loop class*/
    private class Loop implements Expression{
	private int count = 1;
	private boolean firstIter = true;
	/**Implemented eval() method. Runs the expressions a specified number of times.
	 **@param
	 **a Machine instance.*/
	public void eval(Machine machine){
	    if(count > limit)
		return;
	    machine.bind(identifier, count);
	    count++;
	    if(firstIter)
		firstIter = false;
	    else
		machine.popObj();
	    machine.pushExpr(this);
	    machine.pushExpr(expression);
	}
	/**toString() method.
	 **@return
	 **"loop((current position), (limit), (identifier), (expression))"*/
	public String toString(){
	    return "loop(" + count + ", " + limit + ", " + identifier.toString() + ", " + expression.toString() + ")";
	}
    }
}