/**@author Matthew Morrissey
 **@version 1.0
 **This class allows for the creation of Identifiers to be used in the HashMap of the Machine*/
public class Identifier implements Expression{
    private String identifier;
    /**Constructor for the Identifier class.
     **@param
     **the String to be used as the key for the HashMap.*/
    public Identifier(String key){
	identifier = key;
    }
    /**Overriden equals() method. Checks to see if the keys are equivalent.
     **@param
     **an Object to be compared to the Identifier.*/
    @Override
    public boolean equals(Object obj){
	if(this == obj)
	    return true;
	if(obj instanceof Identifier)
	    return this.identifier.equals(((Identifier)obj).identifier);
	return ((String)obj) == identifier;
    }
    /**Implemented eval() method. Searches the HaspMap for the given Identifier.
     **@param
     **a Machine instance.*/
    public void eval(Machine machine){
	Identifier key = new Identifier(identifier);
	Object value = machine.lookup(key);
	if(value == null)
	    throw new RuntimeException("unbound identifier" + identifier);
	else
	    machine.pushObj(value);
    }
    /**@return
     **the hash code for the Identifier.*/
    public int hashCode(){
	return identifier.hashCode();
    }
    /**@return
     **"(Identifier)"*/
    public String toString(){
	return identifier;
    }
}