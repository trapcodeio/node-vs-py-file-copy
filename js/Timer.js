class Timer {
    constructor(start = true) {
        if (start) this.start();
    }

    start() {
        this.startDate = new Date();
    }

    stop() {
        this.stopDate = new Date();
    }

    diff() {
        return this.stopDate.getTime() - this.startDate.getTime();
    }

    diff_ms() {
        return this.diff() + 'ms';
    }
}

// Timer.prototype.startDate = new Date();
// Timer.prototype.stopDate = new Date();

module.exports = Timer;