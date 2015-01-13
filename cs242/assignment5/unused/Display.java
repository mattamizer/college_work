public class Display implements Expression{
    public void eval(Machine machine){
	System.out.println(machine.peekObj().toString());
    }
    public String toString(){
	return "Display()";
    }
}