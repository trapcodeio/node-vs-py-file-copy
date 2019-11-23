package main

import (
	"fmt"
	. "helpers"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Start Timer
var startTime = time.Now()

// Import Configuration
var config = ReadConfigFile()

// Create Stats Structure
type Stats struct {
	files   int
	folders int
	size    int64
}

type File struct {
	path string
	size int64
}

// Store Stats
var stats = Stats{files: 0, folders: 0, size: 0}

var files []File

// Main Function
func main() {

	// Find Source folder
	if !FolderExists(config.From) {
		log.Fatalln("Cannot find source folder: " + config.From)
	}

	// Check if to folder exists
	if !FolderExists(config.To) {
		println("Creating: " + config.To)
		err := os.MkdirAll(config.To, 0700)
		if err != nil {
			log.Fatalln(err.Error())
		}
	}

	// Scan Dir
	println("SCANNING: " + config.From)
	err := filepath.Walk(config.From, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			stats.folders++
		} else if info.Mode().IsRegular() {
			stats.files++
			stats.size += info.Size()
			files = append(files, File{path: path, size: info.Size()})
		}

		return nil
	})

	if err != nil {
		log.Fatalln(fmt.Sprintf("error walking the path %s: %v\n", config.From, err))
		return
	}

	// Start Copy
	for _, file := range files {
		destination := strings.ReplaceAll(file.path, config.From, config.To)
		Verbose("")
		Verbose("From: " + file.path)
		Verbose("To: " + destination)

		source, err := os.Open(file.path)

		if err == nil {
			err := os.MkdirAll(filepath.Dir(destination), 0700)
			printError(err)

			if err == nil {
				target, err := os.Create(destination)
				printError(err)

				if err == nil {

					_, err := io.Copy(target, source)
					printError(err)

					if err == nil {
						target.Close()
						Verbose("Size: " + FileSizeToString(file.size))
					}

				}
			}

			source.Close()

		} else {
			printError(err)
		}
	}

	// Print Stats
	println()
	println("Size: ", FileSizeToString(stats.size))
	println("Files: ", stats.files)
	println("Folders: ", stats.folders)

	endTime := time.Now()
	totalTime := endTime.Sub(startTime).Milliseconds()
	timeToSeconds := fmt.Sprintf("%d%s", totalTime, "ms")
	println("Total Time: ", timeToSeconds)
}

func printError(err error) {
	if err != nil {
		println("ERROR ==> ", err.Error())
	}
}
