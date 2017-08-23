/**
 * BirdWhisperer
 * by 2gua
 */
import './assets/index.css';

class BirdWhisperer {
    chirping: string;
    constructor(message: string) {
        this.chirping = message;
    }
    chirp() {
        return 'Ah~ oh~ ' + this.chirping;
    }
}
let birdWhisperer = new BirdWhisperer('coo-coo-coo...');
document.body.innerHTML = birdWhisperer.chirp();