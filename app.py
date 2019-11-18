# Import os
import os
# Import Json
import json
# Import helpers
from helpers.helper import size_to_string, verbose
# import File copier
from shutil import copy
# Import date library
from datetime import datetime

# Import Configuration
with open('./config.json') as config_file:
    config = json.load(config_file)

# Start Timer
start_time = datetime.now()

# Stores stats
stats = dict(
    files=0,
    folders=0,
    size=0
)

# Shorthand var to config
to_dir = config['to']
from_dir = config['from']

# Find source folder
if not os.path.exists(from_dir):
    print('Cannot find source folder: ' + from_dir)
    exit()

# Check if to folder exists
if not os.path.exists(to_dir):
    # try creating destination folder or fail
    try:
        print('Creating: ' + to_dir)
        os.mkdir(to_dir)
    except:
        print('Cannot create folder: ' + to_dir +
              '}, try creating this folder manually.')
        exit()

# Holds all files
files = []

print('SCANNING: ' + from_dir)
for name, dir_list, file_list in os.walk(from_dir):
    # for all folders in from_dir
    for folder in dir_list:
        stats['folders'] += 1

    # for all files in from_dir
    for file in file_list:
        files.append(name + '/' + file)

# copy files
for file in files:

    if config.get('scan_only', False) is True:
        stats['size'] += os.path.getsize(file)
    else:
        # get destination
        destination = file.replace(from_dir, to_dir)
        verbose()
        verbose('From: ' + file)
        verbose('To: ' + destination)
        try:
            # Create dir of destination folder
            destination_folder = os.path.dirname(destination)
            if not os.path.exists(destination_folder):
                os.makedirs(destination_folder)
            # Copy File to Folder
            copy(file, destination)
            # Add file to size
            file_size = os.path.getsize(file)
            stats['size'] += file_size
            verbose('Size: ' + size_to_string(file_size))
        except Exception as e:
            verbose('--FAILED: ' + str(e))

# Convert Size to readable text
stats.update({
    'size': size_to_string(stats['size']),
    'files': len(files)
})
# Spacing
print()
print()
# stop Main Timer
stop_time = datetime.now()
print(stop_time - start_time)

print(stats)
