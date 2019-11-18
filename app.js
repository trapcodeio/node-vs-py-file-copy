// Start Timer
console.time('TOTAL TIME');
// Import Fs for file management.
const Fs = require('fs');
// Import Path for path management.
const Path = require('path');
// Import helpers
const {size_to_string, exit, verbose} = require("./js/helpers");
// Import Configuration.
const config = require('./config');
// Stores stats
const stats = {
    files: 0,
    folders: 0,
    size: 0
};

// Find source folder.
if (!Fs.existsSync(config.from)) {
    console.log(`Cannot find source folder: ${config.to}`);
    exit()
}

if (!Fs.existsSync(config.to)) {
    // try creating destination folder or fail
    try {
        console.log(`Creating: ${config.to}`);
        Fs.mkdirSync(config.to, {recursive: true});
    } catch (e) {
        console.log(`Cannot create folder: ${config.to}, try creating this folder manually.`);
        exit()
    }
}

// Holds all files
const files = [];

/**
 * Scan folder
 * @param dir - Folder to scan
 * @param deep - Should open folders
 * @param recursive - Use if calling scan_dir from scan_dir
 */
const scan_dir = (dir, deep, recursive = false) => {
    // Check if path exists if not recursive.
    // Prevents checking a file when we are already sure it exists
    if (!recursive && !Fs.existsSync(dir)) {
        console.log(`${dir} does not exist.`);
        return exit();
    }

    // Scan dir
    let contents = Fs.readdirSync(dir);
    for (const content of contents) {
        // Make full path to content
        const content_path = `${dir}/${content}`;
        const content_is_dir = content_path !== dir && Fs.statSync(content_path).isDirectory();

        // if path is directory scan_dir else add full path to array
        if (deep && content_is_dir) {
            stats.folders++;
            scan_dir(content_path, true, true);
        } else {
            files.push(content_path);
        }
    }
};

// ------------------------------------------------------------------------------------------------
// ------------------------------------------ START -----------------------------------------------
// ------------------------------------------------------------------------------------------------
console.log(`SCANNING: ${config.from}`);
// Scan Dir
scan_dir(config.from, config.scan_deep);

// Loop through files and copy each to new destination
for (const file of files) {
    const destination = file.replace(config.from, config.to);

    if (config.scan_only === true) {
        stats.size += Fs.statSync(file).size;
    } else {
        verbose();
        verbose('From: ' + file);
        verbose('To: ' + destination);
        try {
            // Create dir of destination folder
            Fs.mkdirSync(Path.dirname(destination), {recursive: true});
            // Copy File to Folder
            Fs.copyFileSync(file, destination);
            // Add to file size
            const file_size = Fs.statSync(file).size;
            stats.size += file_size;
            verbose('Size: ' + size_to_string(file_size))
        } catch (e) {
            verbose('--FAILED: ' + e.message);
        }
    }
}

// Convert Size to readable text
stats.size = size_to_string(stats.size, 1);
// Set files in stats
stats.files = files.length;
// Spacing
console.log();
console.log();
// Stop Main Timer
console.timeEnd('TOTAL TIME');
// Log Stats
console.log(stats);