class NogenVoiceAssistant {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.triggerWord = 'nogen';
        this.isListening = false;
        this.hasInitialized = false;
        this.greeted = false;
        this.recognitionRunning = false;
        this.isRecognizing = false;

        this.onNavigate = null; // for React Router navigation
    }

    start() {
        if (this.hasInitialized) {
            console.log("⚠️ Nogen already initialized");
            return;
        }

        console.log("🔥 Nogen start() called");
        this.hasInitialized = true;

        document.addEventListener("click", () => {
            if (!this.recognitionRunning) {
                this.initRecognition();
            }
        }, { once: true });
    }

    initRecognition() {
        try {
            console.log("🎤 Initializing speech recognition...");
            this.recognitionRunning = true;

            this.recognition.onstart = () => {
                this.isRecognizing = true;
                console.log("🎙️ Recognition started");
            };

            this.recognition.onresult = this.processCommand.bind(this);

            this.recognition.onerror = (event) => {
                console.error("❌ Speech error:", event.error);
                this.isRecognizing = false;

                if (['aborted', 'no-speech', 'network'].includes(event.error)) {
                    console.warn("⚠️ Restarting recognition due to error...");
                    setTimeout(() => this.recognition.start(), 500);
                }
            };

            this.recognition.onend = () => {
                console.log("🔁 Speech recognition ended");
                this.isRecognizing = false;
                if (this.isListening) {
                    setTimeout(() => this.recognition.start(), 500);
                }
            };

            if (!this.isRecognizing) {
                this.recognition.start();
                console.log("✅ Speech recognition started");
            }

            if (!this.greeted) {
                this.greetUser();
                this.greeted = true;
            }

        } catch (error) {
            console.error("❌ Recognition start failed:", error);
            setTimeout(() => this.initRecognition(), 1000);
        }
    }

    greetUser() {
        if (this.synth.speaking) {
            console.log("⏳ Already speaking, skipping greeting");
            return;
        }

        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : 'Good evening';
        const message = `${greeting}, Welcome to Quick Notes AI. I am your assistant, Nogen. Ask anything if you want.`;

        console.log("🗣️ Greeting Message:", message);

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onstart = () => console.log("✅ Started greeting");
        utterance.onend = () => console.log("✅ Finished greeting");
        utterance.onerror = (e) => console.error("❌ Greeting error:", e);

        this.synth.speak(utterance);
    }

    processCommand(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('📥 User said:', transcript);

        if (!this.isListening && transcript.includes(this.triggerWord)) {
            this.isListening = true;
            this.speak('Yes, I am listening. What do you want me to do?');
            return;
        }

        if (this.isListening || transcript.includes(this.triggerWord)) {
            if (
                transcript.includes('ai assistant') &&
                (transcript.includes('go to') || transcript.includes('open') || transcript.includes('turn on'))
            ) {
                this.navigateTo('/AiAssistant');

            } else if (transcript.includes('turn on advanced mode')) {
                this.toggleAdvancedMode(true);

            } else if (transcript.includes('download as word file')) {
                this.downloadNotes('word');

            } else {
                this.fillForm(transcript);
            }
        }
    }

    speak(message) {
        if (!this.synth) {
            console.error("❌ Speech Synthesis not supported");
            return;
        }

        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onstart = () => console.log("🗣️ Speaking:", message);
        utterance.onerror = (event) => console.error("❌ Speech error:", event.error);

        setTimeout(() => {
            this.synth.speak(utterance);
        }, 300);
    }

    toggleAdvancedMode(enable) {
        const message = enable ?
            'Advanced mode activated. You now have access to additional features.' :
            'Advanced mode deactivated.';
        this.speak(message);

        const toggle = document.getElementById('advancedModeToggle');
        if (toggle) {
            toggle.checked = enable;
            toggle.dispatchEvent(new Event('change'));
        }
    }

    fillForm(transcript) {
        const fieldMapping = {
            course: ['course', 'class'],
            subject: ['subject', 'topic'],
            level: ['level', 'difficulty'],
            year: ['year', 'date'],
            topics: ['topics', 'subtopics'],
            format: ['format', 'type']
        };

        let filledAny = false;

        Object.entries(fieldMapping).forEach(([field, keywords]) => {
            if (keywords.some(keyword => transcript.includes(keyword))) {
                const input = document.getElementById(field);
                if (input) {
                    const keyword = keywords.find(k => transcript.includes(k));
                    const value = transcript.split(keyword)[1].trim();
                    input.value = value;
                    this.speak(`Filled ${field} with ${value}`);
                    filledAny = true;
                }
            }
        });

        if (!filledAny) {
            this.speak("I didn't understand that command. Please try again.");
        }
    }

    downloadNotes(format) {
        this.speak(`Preparing your ${format} file for download.`);
        const eventName = `download${format.charAt(0).toUpperCase() + format.slice(1)}`;
        document.dispatchEvent(new CustomEvent(eventName));
    }

    navigateTo(pagePath) {
        this.speak(`Taking you to the ${pagePath.replace('/', '').replace('-', ' ')} page.`);
        if (typeof this.onNavigate === 'function') {
            this.onNavigate(pagePath); // React navigation
        } else {
            window.location.href = pagePath; // Fallback
        }
    }
}

export default NogenVoiceAssistant;
