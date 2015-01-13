public class Bind implements Expression{
    Identifier key;
    public Bind(Identifier identifier){
	key = identifier;
    }
    public void eval(Machine machine){
	Object value = machine.peekObj();
	machine.bind(key, value);
    }
    public String toString(){
	return "Bind(" + key.toString() + ")";
    }
}