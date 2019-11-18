# Import sys
import sys


# Convert file size string to human readable text
def size_to_string(num, suffix='B'):
    # e.g 1MB, 45GB
    for unit in ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)


# Verbose log Helper
def verbose(*args):
    if 'silent' not in sys.argv:
        print(*args)
