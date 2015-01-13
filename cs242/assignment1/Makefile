JCC = javac
JFLAGS = -g
default: NameRank.class NameStore.class
NameRank.class: NameRank.java
	$(JCC) $(JFLAGS) NameRank.java
NameStore.class: NameStore.java
	$(JCC) $(JFLAGS) NameStore.java
clean:
	$(RM) *.class