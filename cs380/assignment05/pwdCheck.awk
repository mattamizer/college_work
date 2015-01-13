$2 == "*" {print "line " NR ", no password:", $0}
NF < 7 {print "line " NR ", does not have 7 fields:", $0}
