# Import the os and reading CSV modules
import os
import csv

# Path to CSV file
csvpath = os.path.join('Resources', 'budget_data.csv')

# Reading using CSV module
with open(csvpath, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Skip the header
    header = next(csvreader)

    # Initialize variables
    countMonths = 0
    totalRevenue = 0
    rowRevenue = 0
    firstRow = True

    # Read each row of data after the header
    for row in csvreader:
        # Add to the months counter
        countMonths = countMonths + 1
        # Add to the total revenue variable
        totalRevenue = totalRevenue + float(row[1])
        # Check whether it is the first row with value so to skip increase/decrease calculation
        if(firstRow == True):
            # If is it the first row, then change the boolean to false for next execution and initialize the variables calculated in the conditional below
            firstRow = False
            totalChange = 0
            maxIncrease = -1000000
            maxDecrease = 1000000
        else:
            # If it is not the first row, then calculate the total of changes and check for maximum and minimum changes
            totalChange = totalChange + (float(row[1]) - rowRevenue)
            if((float(row[1]) - rowRevenue) > maxIncrease):
                maxIncrease = float(row[1]) - rowRevenue
                maxIncreaseMonth = row[0]
            if((float(row[1]) - rowRevenue) < maxDecrease):
                maxDecrease = float(row[1]) - rowRevenue
                maxDecreaseMonth = row[0]
        
        # Save the current revenue value for the next row iteraction, so to calculate the changes in the conditional above
        rowRevenue = float(row[1])

# Output summary to terminal
print("Financial Analysis")
print("------------------")
print("Total Months: " + str(countMonths))
print("Total: $" + str(totalRevenue))
print("Average Change: $" + str(totalChange/(countMonths-1)))
print("Greatest Increase in Profits: " + maxIncreaseMonth + " ($" + str(maxIncrease) + ")")
print("Greatest Decrease in Profits: " + maxDecreaseMonth + " ($" + str(maxDecrease) + ")")

# Open a txt file and write the same output
f = open("output.txt","w")
f.write("Financial Analysis" + "\n")
f.write("------------------" + "\n")
f.write("Total Months: " + str(countMonths) + "\n")
f.write("Total: $" + str(totalRevenue) + "\n")
f.write("Average Change: $" + str(totalChange/(countMonths-1)) + "\n")
f.write("Greatest Increase in Profits: " + maxIncreaseMonth + " ($" + str(maxIncrease) + ")" + "\n")
f.write("Greatest Decrease in Profits: " + maxDecreaseMonth + " ($" + str(maxDecrease) + ")")
f.close()