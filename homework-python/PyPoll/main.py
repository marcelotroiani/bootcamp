# Import the os and reading CSV modules
import os
import csv

# Path to CSV file
csvpath = os.path.join('Resources', 'election_data.csv')

# Reading using CSV module
with open(csvpath, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

    # Skip the header
    header = next(csvreader)

    # Initialize the lists
    listCandidates = []
    listVotesPerCandidate = []

    # Initialize variables
    countVotes = 0
    firstRow = True

    # Read each row of data after the header
    for row in csvreader:
        # Add to the votes counter
        countVotes = countVotes + 1

        # Check if its the first row and initialize the lists
        if(firstRow == True):
            listCandidates.append(row[2])
            listVotesPerCandidate.append(1)
            firstRow = False
        # if its not the first row, then add new candidates to the list or add votes to existing candidates
        else:
            candidateFound = False
            for candidate in listCandidates:
                if(row[2] == candidate):
                    candidateFound = True
                    listVotesPerCandidate[listCandidates.index(candidate)] = listVotesPerCandidate[listCandidates.index(candidate)] + 1
            if(candidateFound == False):
                listCandidates.append(row[2])
                listVotesPerCandidate.append(1)

# Check who is the winner usind list comprehensions
countWinner = 0
for candidate in listCandidates:
    if(listVotesPerCandidate[listCandidates.index(candidate)] > countWinner):
        countWinner = listVotesPerCandidate[listCandidates.index(candidate)]
        winner = candidate

# Print the summary in the terminal
print("Election Results")
print("-------------------")
print("Total Votes: " + str(countVotes))
print("-------------------")
for candidate in listCandidates:
    print(candidate + ": " + "{:.3%}".format(listVotesPerCandidate[listCandidates.index(candidate)]/countVotes) + " (" + str(listVotesPerCandidate[listCandidates.index(candidate)]) + ")")
print("-------------------")
print("Winner: " + winner)
print("-------------------")

# Open a txt file and write the same output
f = open("output.txt","w")
f.write("Election Results" + "\n")
f.write("-------------------" + "\n")
f.write("Total Votes: " + str(countVotes) + "\n")
f.write("-------------------" + "\n")
for candidate in listCandidates:
    f.write(candidate + ": " + "{:.3%}".format(listVotesPerCandidate[listCandidates.index(candidate)]/countVotes) + " (" + str(listVotesPerCandidate[listCandidates.index(candidate)]) + ")" + "\n")
f.write("-------------------" + "\n")
f.write("Winner: " + winner + "\n")
f.write("-------------------")
f.close()