BEGIN {FS=":"; OFS="\t"; ORS="\n"; OFMT="%3.2f";
	print"_____________________________________________________________________________";
	print "Name\t\t\tPhone Number\tJan\tFeb\tMar\tTotal";
	print"_____________________________________________________________________________";
	max = 0;
	min = 9999;
}

{sum = $3 + $4 + $5}
{febSum += $4}
{num++}
{printf "%-23s %-15s %03.2f %03.2f %03.2f %03.2f\n", $1, $2, $3, $4, $5, sum}
{total += sum}
{if($3 <= min) min = $3
	else if($4 <= min) min = $4
	else if($5 <= min) min = $5}
{if($3 >= max) max = $3
	else if($4 >= max) max = $4
	else if($5 >= max) max = $5}

END {
average = febSum / num
print"______________________________________________________________________________"
print"\t\t\t\tSUMMARY"
print"______________________________________________________________________________"
printf"The campaign received a total of $"
printf"%.2f \n",total
printf"The average donation for the 12 contributors for the month of Feb was $"
printf"%.2f \n",average
printf"The highest contribution was $"
printf"%.2f \n",max
printf"The lowest contribution was $"
printf"%.2f \n",min
}
