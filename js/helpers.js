/**
 * Convert file size string to human readable text
 * e.g 1MB, 45GB
 * @param size
 * @param decimals
 * @returns {string|*}
 */
module.exports.size_to_string = (size, decimals = 0) => {
    const bytes = size;
    if (bytes === 0) return '0Bytes';

    const k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
};

/**
 * ShortHand Exit Helper
 */
module.exports.exit = () => process.exit();

/**
 * Log if verbose option is on.
 * @param args
 */
module.exports.verbose = (...args) => {
    // Log if verbose
    if (process.argv[2] === 'verbose') console.log(...args);
};