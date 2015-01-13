/Savage/ {print $1, $2}
/Chet/ {print "Chet has contributed $" ($3 + $4 + $5)}
$3 > 250 {print $1 " contributed more than $250 in the first month."}
