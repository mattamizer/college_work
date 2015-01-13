public class Minivan extends Automobile{
	public boolean equals(Object obj){
		System.out.println("F");
		return(true);
	}
	public boolean equals(Automobile auto){
		System.out.println("G");
		return(true);
	}
	public boolean equals(Minivan minivan){
		System.out.println("H");
		return(true);
	}
}
