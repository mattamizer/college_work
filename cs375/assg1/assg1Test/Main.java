public class Main{
	public static void main(String args[]){
		Object o = new Automobile();
		Automobile auto = new Automobile();
		Automobile sedanAuto = new Sedan();
		Automobile minivanAuto = new Minivan();
		Sedan sedan = new Sedan();
		Minivan minivan = new Minivan();
		
		System.out.println("Object o Cases:");
		o.equals(o);
		o.equals(auto);
		o.equals(sedanAuto);
		o.equals(minivanAuto);
		o.equals(sedan);
		o.equals(minivan);

		System.out.println("Automobile auto Cases:");
		auto.equals(o);
		auto.equals(auto);
		auto.equals(sedanAuto);
		auto.equals(minivanAuto);
		auto.equals(sedan);
		auto.equals(minivan);
		
		System.out.println("Automobile sedanAuto Cases:");
		sedanAuto.equals(o);
		sedanAuto.equals(auto);
		sedanAuto.equals(sedanAuto);
		sedanAuto.equals(minivanAuto);
		sedanAuto.equals(sedan);
		sedanAuto.equals(minivan);

		System.out.println("Automobile minivanAuto Cases:");
		minivanAuto.equals(o);
		minivanAuto.equals(auto);
		minivanAuto.equals(sedanAuto);
		minivanAuto.equals(minivanAuto);
		minivanAuto.equals(sedan);
		minivanAuto.equals(minivan);

		System.out.println("Sedan sedan Cases:");
		sedan.equals(o);
		sedan.equals(auto);
		sedan.equals(sedanAuto);
		sedan.equals(minivanAuto);
		sedan.equals(sedan);
		sedan.equals(minivan);

		System.out.println("Minivan minivan Cases:");
		minivan.equals(o);
		minivan.equals(auto);
		minivan.equals(sedanAuto);
		minivan.equals(minivanAuto);
		minivan.equals(sedan);
		minivan.equals(minivan);

		System.out.println("END OF TEST CASES");
	}
}
