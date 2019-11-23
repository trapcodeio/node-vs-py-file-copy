package helpers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func Verbose(str string) {
	args := os.Args
	if len(args) == 1 || (len(args) > 1 && args[1] != "silent") {
		println(str)
	}
}

type Config struct {
	From     string `json:"from"`
	To       string `json:"to"`
	ScanOnly bool   `json:"scan_only"`
}

func ReadConfigFile() Config {
	plan, _ := ioutil.ReadFile("config.json")
	data := Config{}
	err := json.Unmarshal(plan, &data)

	if err != nil {
		log.Fatal("Cannot load config.json")
	}

	return data
}

func FolderExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	return info.IsDir()
}

func FileSizeToString(b int64) string {
	const unit = 1000
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(b)/float64(div), "kMGTPE"[exp])
}
