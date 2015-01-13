public class Select implements Expression{
    private Object consequent, alternate;
    public Select(Object consequent, Object alternate){
	this.consequent = consequent;
	this.alternate = alternate;
    }
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
    public String toString(){
	return "Select(" + consequent + ", " + alternate + ")";
    }
}