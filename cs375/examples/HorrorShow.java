// You can easily add new method declarations to an interface using
// inheritance, and you can also combine several interfaces into a
// new interface with inheritance.  In both cases you get a new
// interface, as seen in this example.

// HorrowShow.java
// Extending an interface with inheritance

interface Monster {
    void menace();
}

interface DangerousMonster extends Monster {
    void destroy();
}

interface Lethal {
    void kill();
}

class GodZilla implements DangerousMonster {
    public void menace()   {
		System.out.println("menace()");
	}
    public void destroy()  {
		System.out.println("destroy()");
	}
}

interface Vampire extends DangerousMonster, Lethal {
    void drinkBlood();
}

class Dracula extends GodZilla implements Vampire {
     public void destroy() {
		 System.out.println("Vampire.destroy()");
	 }
     public void kill() {
		 System.out.println("Vampire.kill()");
	 }
     public void menace() {
		 System.out.println("Vampire.menace()");
	 }
     public void drinkBlood() {
		 System.out.println("Vampire.drinkBlood()");
	 }
}

public class HorrorShow {

    static void u(Monster b) {
		b.menace();
	}

    static void v(DangerousMonster b)  {
        b.menace();
        b.destroy();
    }

    static void w(Vampire d)    {
        d.menace();
        d.destroy();
        d.kill();
        d.drinkBlood();
    }

    static void x(Lethal d)  {
		d.kill();
	}

    static void y(GodZilla b)  {
        b.menace();
        b.destroy();
    }

    static public void main(String args[])  {
        Dracula movie = new Dracula();

        u(movie);
        v(movie);
        w(movie);
        x(movie);
        y(movie);
    }
}

/*
   DangerousMonster is a simple extension to Monster which produces a
   new interface.  This is implemented in GodZilla.

   The syntax used in Vampire only works when inheriting interfaces.
   Normally, you can only use extends with a single class, but since
   an interface can be made from multiple other interfaces, extends can
   refer to multiple base interfaces when building a new interface.
   As you can see, the interface names are simply seperated with commas.
*/
