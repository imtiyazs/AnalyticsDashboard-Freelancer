import pandas as pd
import codecs
import sys
import json
import re
import os
import savReaderWriter as s

# Check for commandline args
if len(sys.argv) != 3:
    print("Usage: main.py <sourceFileToRead> <DestinationJSONtoWRite>")
    sys.exit(1)

# Set source file and destination from arguments
sourceFile = sys.argv[1]
destinationFile = sys.argv[2]
_, fileExtension = os.path.splitext(sourceFile)

if fileExtension == '.xlsx' or fileExtension == '.xls':
    data = {}
    # Load spreadsheet
    df = pd.read_excel(sourceFile)
    # For each in headers
    #for i, each in enumerate(xl.columns):
         # Decode header to text and set as JSON key. Select first column of dataframe and convert to NPArray
    #    data[each.decode("utf-8")] = xl.iloc[:, i].values.astype(str).tolist()

    df.dropna(axis=0, inplace=True)

    #drop duplicate values
    df.drop_duplicates(keep='last',inplace=True)

    #fetch data type of columns
    dtypeList = df.dtypes
    i=0
    for singleColumn in df.columns:
        #Sent all column data
        #data[singleColumn] = df[singleColumn].values.tolist()
        
        #Sent int & float columns only
        if dtypeList[i]!='object' :
            data[singleColumn] = df[singleColumn].values.tolist()
        i = i+1

    # Save to destination
    json.dump(data, codecs.open(destinationFile, 'w',
                                    encoding='utf-8'), sort_keys=True, indent=4)

#  READ SAV OR SPSS FILES
if fileExtension == '.sav':
    rawFileData = s.SavReader(sourceFile, returnHeader=True)

    # fetch Data Data
    df = pd.DataFrame(list(rawFileData)[1:len(list(rawFileData))])
    headerInBytes = list(rawFileData)[0]

    # Blank json object
    data = {}

    # For each in headers
    #for i, each in enumerate(headerInBytes):
        # Decode header to text and set as JSON key. Select first column of dataframe and convert to NPArray
    #    data[each.decode("utf-8")] = df.iloc[:, i].values.astype(str).tolist()

    #byte to string
    dfColumns = [singleColumn.decode("utf-8") for singleColumn in headerInBytes]

    #Set names of columns
    df.columns = dfColumns

    #drop missing values
    df.dropna(axis=0, inplace=True)

    #drop duplicate values
    df.drop_duplicates(keep='last',inplace=True)


    dtypeList = df.dtypes
    i=0
    for singleColumn in df.columns:
        #Sent all column data
        #data[singleColumn] = df[singleColumn].values.tolist()
        
        #Sent int & float columns only
        if dtypeList[i]!='object' :
            data[singleColumn] = df[singleColumn].values.tolist()
        i = i+1

    # Save to destination
    json.dump(data, codecs.open(destinationFile, 'w',
                                encoding='utf-8'), sort_keys=True, indent=4)

if fileExtension == '.csv':
    data = {}
    # Load spreadsheet
    df = pd.read_csv(sourceFile)

    #drop missing values
    df.dropna(axis=0, inplace=True)

    #drop duplicate values
    df.drop_duplicates(keep='last',inplace=True)

    #fetch data type of columns
    dtypeList = df.dtypes
    i=0
    for singleColumn in df.columns:
        #Sent all column data
        #data[singleColumn] = df[singleColumn].values.tolist()
        
        #Sent int & float columns only
        if dtypeList[i]!='object' :
            data[singleColumn] = df[singleColumn].values.tolist()
        i = i+1

    # Save to destination
    json.dump(data, codecs.open(destinationFile, 'w',
                                    encoding='utf-8'), sort_keys=True, indent=4)
