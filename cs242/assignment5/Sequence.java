/**@author Matthew Morrissey
 **@version 1.0
 **This is a class that allows the virtual machine to understand and execute sequences.*/
public class Sequence implements Expression{
    private Object[] exprs;
    /**Constructor for the Sequence class.
     **@param
     **one or more Objects and stores them in an array.*/
    public Sequence(Object ... exprs){
	this.exprs = exprs;
	if(exprs.length == 0)
	    throw new RuntimeException("Sequence must be created with 1 or more subexpressions");
    }
    /**Implemented eval() method. Pushes Objects onto the expression stack for evaluation.
     **@param
     **an instance of Machine.*/
    public void eval(Machine machine){
	if(exprs.length == 1)
	    machine.pushExpr(exprs[0]);
	else{
	    int size = exprs.length;
	    machine.pushExpr(exprs[size-1]);
	    for(int i = size-2; i>=0; i--){
		machine.pushExpr(new Drop());
		machine.pushExpr(exprs[i]);
	    }
	}
    }
    /**toString() method.
     **@return
     **"seq, [Objects], end"*/
    public String toString(){
	String string = "seq ";
	for(int i = 0; i < exprs.length; i++)
	    string += exprs[i].toString() + " ";
	string += "end";
	return string;
    }
    /**Inner Drop class.*/
    private class Drop implements Expression{
	/**Implemented eval() method. Pops and Object off the object stacke.*/
	public void eval(Machine machine){
	    machine.popObj();
	}
	/**toString() method.
	 **@return
	 **"Drop()"*/
	public String toString(){
	    return "Drop()";
	}
    }
}