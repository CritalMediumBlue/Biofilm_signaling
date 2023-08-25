import pandas as pd

# Loading the CSV file
file_path = "/mnt/data/bacteria_counts(15).csv"
data = pd.read_csv(file_path)

# Displaying the first few rows of the data
data.head()

import matplotlib.pyplot as plt

# Calculating the total number of cells for each iteration
data['total'] = data['pink'] + data['blue'] + data['green']

# Plotting the total number of cells
plt.figure(figsize=(12, 6))
plt.plot(data['total'], label='Total Cells')
plt.title('Total Number of Cells in Each Iteration')
plt.xlabel('Iteration')
plt.ylabel('Total Cells')
plt.legend()
plt.grid(True)
plt.show()