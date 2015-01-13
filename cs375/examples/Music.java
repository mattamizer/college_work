import java.util.ArrayList;

/*
Interfaces are an important concept in Java.  An interface is a
skeleton of a class, showing the methods the class will have when
someone implements them.

Defining an interface is just like defining a class, except the class
keyword is replaced with the interface keyword, and only constants
and abstract methods are allowed in an interface.  Every interface is by
default abstract.  All the methods declared in an interface are by default
abstract and public, so you do not need to explicitly put the abstract or
public modifiers before them.  Similarly, all the data members declared
in an interface are by default public static constants, and you do
not need to explicitly insert the final, static, or public modifers
before them (BUT IT IS A GOOD IDEA FOR YOU TO SPECIFY THEM).

In an interface you cannot have method bodies.  You can have only
declarations.  Interfaces do not need storage and they don't
have a physical representation.

An interface is used to define a common set of methods for multiple
classes.  (A package is a technique for grouping classes with similar
characteristics).

If a class does not implement all the methods of an interface it becomes
an abstract class.

You cannot instantiate an object of interface type.  What you need is a
class that implements an interface.

An interface is used to specify the form that something MUST have, but not
actually provide the implementation.  In this sense, a  interface is a
little like an abstract class, that must be extended in exactly the manner
that its methods present.  An interface differs from an abstract class in
the following ways:

(1)  A class can implement several interfaces at once, whereas a class can
     only extend one parent class.

(2)  An interface doesn't have any overtones of specilization that are
     present with inheritance.  It merely says, "well, we need
     something that does "foo"  and here are the ways that users should
     be able to call it"

(3)  Interfaces can be used to support call backs. (Inheritance doesn't`
     help with this).

*/

// Music.java
// Interfaces

interface Instrument {
    public static final int i = 5;
    // compile time constant.  public, static & final
    // you can have constants in an interface.

    // cannot have method definitions, only method headers
    public abstract void play();    // automatically public and abstract
    public abstract String what();
    // preferrable to put both public and abstract
    public abstract void adjust();
}

class Wind implements Instrument {
    public void play()    {
        System.out.println("Wind.play()");
    }

    public String what() { return ("Wind");  }

    public void adjust()    {
        System.out.println("Wind.adjust()");
    }
}

class Percussion implements Instrument {
    public void play()    {
        System.out.println("Percussion.play()");
    }

    public String what() { return ("Percussion");  }

    public void adjust()    {
        System.out.println("Percussion.adjust()");
    }
}

class Stringed implements Instrument {
    public void play()    {
        System.out.println("Stringed.play()");
    }

    public String what() { return ("Stringed");  }

    public void adjust()    {
        System.out.println("Stringed.adjust()");
    }
}


class Brass extends Wind {
    public void play()    {
        System.out.println("Brass.play()");
    }

    public String what() { return ("Brass");  }
}

class WoodWind extends Wind {
    public void play()    {
        System.out.println("WoodWind.play()");
    }

    public String what() { return ("WoodWind");  }
}

public class Music {
// doesn't care about type, so new types added to the system
// still work right
    static void tune(Instrument anInstrument) {
        System.out.println(anInstrument.what());
        anInstrument.adjust();
        anInstrument.play();
        System.out.println(anInstrument.what() + "'s constant is " +
                 anInstrument.i);
        System.out.println();
    }

    static void tuneAll(ArrayList<Instrument> e)    {
        for (int ii = 0; ii < e.size(); ii++)
             tune(e.get(ii));
    }

    public static void main(String args[]) {
        ArrayList <Instrument> orchestra = new ArrayList<Instrument> ();

        // upcasting while adding to the array
        // orchestra.add(new Instrument() );
        orchestra.add(new Wind() );
        orchestra.add(new Percussion() );
        orchestra.add(new Stringed() );
        orchestra.add(new Brass() );
        orchestra.add(new WoodWind() );

        tuneAll(orchestra);
    }
}