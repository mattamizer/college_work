/**@author Matthew Morrissey
 **@version 1.0
 **This class allows for the execution of simple if->then->else statements.*/
public class If implements Expression{
    private Object condition, consequent, alternate;
    /**Constructor for the If class.
     **@param
     **three Objects: condition, consequent, and alternate.*/
    public If(Object condition, Object consequent, Object alternate){
	this.condition = condition;
	this.consequent = consequent;
	this.alternate = alternate;
    }
    /**Implemented eval() method. Pushes and new Select instance and the condition onto the expression stack.
     **@param
     **a Machine instance.*/
    public void eval(Machine machine){
	machine.pushExpr(new Select());
	machine.pushExpr(condition);
    }
    /**@return
     **"if (condition) then (consequent) else (alternate)"*/
    public String toString(){
	return "If " + condition + " then " + consequent + " else " + alternate;
    }
    /**Inner Select class*/
    private class Select implements Expression{
	/**Implemented eval() method. Evaluates the given if->then->else conditionals.
	 **@param
	 **a Machine instance.*/
        public void eval(Machine machine){
	    Object condition = machine.popObj();
	    if(condition instanceof Boolean){
		if(((Boolean)condition).booleanValue())
		    machine.pushExpr(consequent);
		else
		    machine.pushExpr(alternate);
		return;
	    }
	    throw new RuntimeException("Select expected a boolean expression, found " + condition);
	}
	/**@return
	 **"Select((consequent), (alternate))"*/
	public String toString(){
	    return "Select(" + consequent + ", " + alternate + ")";
	}
    }
}