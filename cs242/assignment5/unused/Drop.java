public class Drop implements Expression{
    public void eval(Machine machine){
	machine.popObj();
    }
    public String toString(){
	return "Drop()";
    }
}