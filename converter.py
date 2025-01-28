import json
import csv

def convert_json_to_csv():
    # Read the JSON data
    with open('s.json', 'r') as file:
        data = json.load(file)

    # Open a CSV file to write
    with open('personality_questions.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        
        # Write header
        writer.writerow(['Question', 'Disagree strongly', 'Disagree moderately', 
                        'Disagree a little', 'Neither agree nor disagree', 
                        'Agree a little', 'Agree moderately', 'Agree strongly'])
        
        # Write data rows
        for item in data:
            row = [item['text']]
            # Add values for each option
            for option in item['options']:
                row.append(option['value'])
            writer.writerow(row)

convert_json_to_csv()