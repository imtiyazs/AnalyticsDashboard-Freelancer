import pandas as pd
import savReaderWriter as s
import codecs, sys, json, re

# Check for commandline args
if len (sys.argv) != 3 :
    print("Usage: main.py <sourceFileToRead> <DestinationJSONtoWRite>")
    sys.exit (1)

# Set source file and destination from arguments
sourceFile = sys.argv[1]
destinationFile = sys.argv[2]

rawFileData = s.SavReader(sourceFile,returnHeader=True)

# fetch Data Data 
df = pd.DataFrame(list(rawFileData)[1:len(list(rawFileData))])
headerInBytes = list(rawFileData)[0]

# Blank json object
data = {}

# For each in headers
for i, each in enumerate(headerInBytes):
    # Decode header to text and set as JSON key. Select first column of dataframe and convert to NPArray
    data[each.decode("utf-8") ] = df.iloc[:,i].values.astype(str).tolist()

# Save to destination
json.dump(data, codecs.open(destinationFile, 'w', encoding='utf-8'), sort_keys=True, indent=4)
