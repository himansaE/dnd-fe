class PCMProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.chunks = [];
        this.sampleIndex = 0;

        this.port.onmessage = (e) => {
            if (e.data) {
                this.chunks.push(e.data);
            }
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const channelL = output[0];
        const channelR = output[1];

        // output buffers are usually 128 frames long
        const frameCount = channelL.length;

        for (let i = 0; i < frameCount; i++) {
            // Read Left Sample
            const sampleL = this.readSample();
            // Read Right Sample
            const sampleR = this.readSample();

            channelL[i] = sampleL;
            if (channelR) {
                channelR[i] = sampleR;
            }
        }

        return true;
    }

    readSample() {
        if (this.chunks.length === 0) return 0;

        const currentChunk = this.chunks[0];

        if (this.sampleIndex >= currentChunk.length) {
            this.chunks.shift();
            this.sampleIndex = 0;
            return this.readSample();
        }

        const int16 = currentChunk[this.sampleIndex++];
        return int16 / 32768.0;
    }
}

registerProcessor("pcm-processor", PCMProcessor);
