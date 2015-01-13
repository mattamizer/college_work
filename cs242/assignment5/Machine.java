import java.util.LinkedList;
import java.util.HashMap;
/**@author Matthew Morrissey
 **@version 1.0
 **This is a class that implements the methods of a simple Virtual Machine*/
public class Machine{
    private LinkedList<Object> objStack;
    private LinkedList<Object> exprStack;
    private HashMap<Identifier, Object> env;
    /**Constructor for the Machine class. Creates empty Object and Expression
     **LinkedLists to be used as stacks for adding Objects and Expressions.
     **It also creates an empty HashMap to store variables.*/
    public Machine(){
	objStack = new LinkedList<Object>();
	exprStack = new LinkedList<Object>();
	env = new HashMap<Identifier, Object>();
    }
    /**bind() method. Binds the given variables to the HashMap.
     **@param
     **an Identifier instance and an Object*/
    public void bind(Identifier identifier, Object value){
	env.put(identifier, value);
    }
    /**@param
     **an Identifier to lookup in the HashMap*/
    public Object lookup(Identifier identifier){
	return env.get(identifier);
    }
    /**@param
     **an Object to be pushed onto the front of objStack*/
    public void pushObj(Object obj){
	objStack.push(obj);
    }
    /**@return
     **an Object off the front of objStack*/
    public Object popObj(){
	return objStack.pop();
    }
    /**@return
     **the value of the first Object in the objStack*/
    public Object peekObj(){
	return objStack.peek();
    }
    /**@param
     **an Object to be pushed onto the front of exprStack*/
    public void pushExpr(Object obj){
	exprStack.push(obj);
    }
    /**@return
     **an Object off the front of exprStack LinkedList*/
    public Object popExpr(){
	return exprStack.pop();
    }
    /**@return
     **true if the expression was evaluated successfully, otherwise if the LinkedList
     **is empty or the evaluation was unsuccessful returns false.*/
    public boolean step(){
	if(!exprStack.isEmpty()){
	    Object expr = this.popExpr();
	    System.out.println("Evaluating " + expr + " | " + this);
	    if(expr instanceof Expression)
		((Expression)expr).eval(this);
	    else
		pushObj(expr);
	    return true;
	}
	else
	    return false;
    }
    /**Runs the step() method until it returns false*/
    public void run(){
	while(step());
    }
    /**@return
     **String description of the Machine*/
    public String toString(){
	return "Machine(" + objStack + ", " + exprStack + ")";
    }
}