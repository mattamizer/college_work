/**@author Matthew Morrissey
 **@version 1.0
 **This class allows for the definition of expressions.*/
public class Define implements Expression{
    private Identifier identifier;
    private Object expression;
    /**Constructor for the Define class.
     **@param
     **an Identifier instance and an Object that will be the expression.*/
    public Define(Identifier identifier, Object expression){
	this.identifier = identifier;
	this.expression = expression;
    }
    /**Implemented eval() method. Pushes a new Bind instance and the expression onto the expression stack.
     **@param
     **a Machine instance.*/
    public void eval(Machine machine){
	machine.pushExpr(new Bind());
	machine.pushExpr(expression);
    }
    /**@return
     **"define (Identifier) = (expression)"*/
    public String toString(){
	return "define " + identifier.toString() + " = " + expression.toString();
    }
    /**Inner Bind class.*/
    private class Bind implements Expression{
	/**Implemented eval() method. Binds the identifier and the expression to the HashMap.
	 **@param
	 **a Machine instance.*/
	public void eval(Machine machine){
	    Object value = machine.peekObj();
	    machine.bind(identifier, value);
	}
	/**@return
	 **"bind((Identifier))"*/
	public String toString(){
	    return "Bind(" + identifier.toString() + ")";
	}
    }
}