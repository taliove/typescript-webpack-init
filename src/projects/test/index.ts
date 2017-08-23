/**
 * BirdWhisperer
 */
import './assets/index.css';

class BirdWhisperer {
    chirping: string;
    constructor(message: string) {
        this.chirping = message;
    }
    chirp() {
        return 'Welcome ' + this.chirping;
    }
}
let birdWhisperer = new BirdWhisperer('hello world.');
document.getElementById("app-desc").innerHTML = birdWhisperer.chirp();