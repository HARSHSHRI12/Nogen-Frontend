import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Packer, Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import './AiAssistant.css';
import { useNavigate } from 'react-router-dom';
import QuizComponent from '../components/QuizComponent';

const boldFont = StandardFonts.HelveticaBold;

const AiAssistant = () => {
  const navigate = useNavigate();
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  // State declarations
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'assistant',
      text: "Hello! I'm your AI assistant. Choose 'Notes Mode' for generating comprehensive notes or switch to 'Tutor Mode' for interactive learning. Please fill in your details to get started.",
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(true);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [advancedInput, setAdvancedInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTutorMode, setIsTutorMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [tutorRequestType, setTutorRequestType] = useState('');
  //for quize 
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizButton, setShowQuizButton] = useState(false); // Show quiz button ke liye state
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    if (messages.some((m) => m.role === 'assistant')) {
      setShowQuizButton(true);
    }
  }, [messages]);

  // Model Validation Effect
  useEffect(() => {
    const validModels = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'llama3-8b-8192'];
    if (!validModels.includes(selectedModel)) {
      console.log("Switching to Groq default model...");
      setSelectedModel('llama-3.3-70b-versatile');
    }
  }, [selectedModel]);


  const generateNotesAndQuiz = async () => {
    // Your notes generation logic here...
    const notes = "Some AI generated content...";

    // Dummy logic to generate questions from notes (replace with API later)
    const generatedQuestions = [
      {
        question: "What is OSI model?",
        options: ["A protocol", "A software", "A networking model", "A hardware device"],
        answer: "A networking model",
      },
      {
        question: "Which layer handles routing?",
        options: ["Transport", "Network", "Data Link", "Application"],
        answer: "Network",
      }
    ];

    //  Navigate to quiz page with questions
    navigate('/quiz', { state: { questions: generatedQuestions } });
  };

  //some implementation of quize

  const questions = [
    { question: "What is 2 + 2?", options: ["2", "3", "4", "5"], correctAnswer: "4", topic: "Math" },
    { question: "What is 5 + 5?", options: ["5", "10", "15", "20"], correctAnswer: "10", topic: "Math" },
    // Add more questions here
  ];
  useEffect(() => {
    // Here, you can make an API call to fetch quiz questions or set default ones
    setQuizQuestions(questions);
  }, []);

  const startQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleQuizCompletion = (result) => {

  };

  const submitQuizResult = async (result) => {

  };
  const [settings, setSettings] = useState({
    speechRate: 1,
    speechPitch: 1,
    voice: 'default',
    theme: 'light',
    autoSpeak: false
  });

  const [userDetails, setUserDetails] = useState({
    course: '',
    classLevel: '',
    yearSem: '',
    subject: '',
    importantTopics: '',
    formatPreference: 'bullet-points'
  });

  const [errors, setErrors] = useState({
    course: '',
    subject: '',
    classLevel: '',
    yearSem: ''
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionSupported) {
      addMessage('assistant', 'Your browser does not support voice input');
      return;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addMessage('assistant', `Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        if (isListening) setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (error) {
      addMessage('assistant', 'Speech recognition setup failed.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    try {
      if (settings?.theme) {
        document.body.className = settings.theme;
      } else {
        console.warn('Theme not found in settings');
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }, [settings?.theme]);


  // Auto-scroll to bottom with debounce
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      try {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Scroll error:', error);
      }
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [chatHistory, generatedImages]);


  const onQuizComplete = () => {
    const result = {
      userId: "Harsh", // Replace with actual user id (can be from JWT/Auth later)
      subject: "Operating System",
      topics: ["CPU Scheduling", "Deadlocks"],
      score: 7,
      totalQuestions: 10,
    };
    submitQuizResult(result);
  };



  // Focus input when form is submitted
  useEffect(() => {
    if (!showDetailsForm) {
      try {
        inputRef.current?.focus();
      } catch (error) {
        console.error('Focus error:', error);
      }
    }
  }, [showDetailsForm]);

  // {/* Quiz Button when notes are generated */}

  {
    showQuizButton && (
      <motion.div
        className="chat-header"
        onClick={() => navigate('/quiz')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Quiz
      </motion.div>
    )
  }

  // Format year/semester input with better validation
  const formatYearSemInput = useCallback((value) => {
    try {
      let formatted = value.replace(/[^0-9stndrdth\/]/gi, '');

      formatted = formatted.replace(/(\d+)([a-z]*)/gi, (match, num, suffix) => {
        const n = parseInt(num, 10);
        if (isNaN(n)) return match;

        let s = suffix.toLowerCase();
        if (!s) {
          if (n === 1) s = 'st';
          else if (n === 2) s = 'nd';
          else if (n === 3) s = 'rd';
          else s = 'th';
        }

        return n + s;
      });

      return formatted;
    } catch (error) {
      console.error('Formatting error:', error);
      return value;
    }
  }, []);

  // Speak the last assistant message with better cleanup
  const speak = useCallback((text) => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speechRate;
      utterance.pitch = settings.speechPitch;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      setIsSpeaking(false);
    }
  }, [settings.speechPitch, settings.speechRate]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Toggle speech recognition with better state management
  const toggleListening = useCallback(() => {
    try {
      if (!recognitionRef.current) {
        alert('Speech recognition not supported or failed to initialize');
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setMessage(''); // Clear input when starting new recognition
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Speech recognition toggle failed:', error);
      setIsListening(false);
    }
  }, [isListening]);

  // Validation rules with more robust checks
  const validateField = useCallback((name, value) => {
    try {
      const trimmedValue = value.trim();

      switch (name) {
        case 'course':
          if (!trimmedValue) return 'Course is required';
          if (trimmedValue.length < 2) return 'Course must be at least 3 characters';
          if (/^\d/.test(trimmedValue)) return 'Course cannot start with a number';
          if (/[^a-zA-Z0-9\s\-]/.test(trimmedValue)) return 'Invalid characters';
          return '';

        case 'subject':
          if (!trimmedValue) return 'Subject is required';
          if (trimmedValue.length < 2) return 'Subject must be at least 3 characters';
          if (/^\d/.test(trimmedValue)) return 'Subject cannot start with a number';
          if (!/^[a-zA-Z]/.test(trimmedValue)) return 'Subject must start with a letter';
          if (/[^a-zA-Z0-9\s\-]/.test(trimmedValue)) return 'Subject contains invalid characters';
          return '';

        case 'classLevel':
          if (trimmedValue && !/^[a-zA-Z0-9\s\-]+$/.test(trimmedValue)) return 'Invalid characters';
          return '';

        case 'yearSem':
          if (!trimmedValue) return '';

          if (!/^\d+(st|nd|rd|th)\/\d+(st|nd|rd|th)$/i.test(trimmedValue)) {
            return 'Format must be like: 2nd/4th';
          }

          const [yearStr, semStr] = trimmedValue.split('/');
          const yearNum = parseInt(yearStr, 10);
          const semNum = parseInt(semStr, 10);

          if (isNaN(yearNum)) return 'Invalid year number';
          if (isNaN(semNum)) return 'Invalid semester number';
          if (yearNum < 1 || yearNum > 6) return 'Year must be between 1st and 6th';
          if (semNum < 1 || semNum > 8) return 'Semester must be between 1st and 8th';
          if (semNum > yearNum * 2) return 'Semester exceeds year range';

          return '';

        default:
          return '';
      }
    } catch (error) {
      console.error('Validation error:', error);
      return 'Validation error occurred';
    }
  }, []);

  // Handle form input changes with validation
  const handleDetailChange = useCallback((e) => {
    const { name, value } = e.target;

    try {
      if (name === 'yearSem') {
        const formattedValue = formatYearSemInput(value);
        setUserDetails(prev => ({ ...prev, [name]: formattedValue }));

        const error = validateField(name, formattedValue);
        setErrors(prev => ({ ...prev, [name]: error }));
        return;
      }

      setUserDetails(prev => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    } catch (error) {
      console.error('Input change error:', error);
    }
  }, [formatYearSemInput, validateField]);

  // Validate all fields before submission
  const validateAll = useCallback(() => {
    try {
      const newErrors = {
        course: validateField('course', userDetails.course),
        subject: validateField('subject', userDetails.subject),
        classLevel: validateField('classLevel', userDetails.classLevel),
        yearSem: validateField('yearSem', userDetails.yearSem)
      };
      setErrors(newErrors);

      return !Object.values(newErrors).some(error => error);
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [userDetails, validateField]);

  // Submit user details with validation
  const submitUserDetails = useCallback(() => {
    try {
      if (!validateAll()) {
        return;
      }

      setShowDetailsForm(false);
      addMessage('assistant', `Great! I'm ready to help with ${userDetails.subject} for ${userDetails.course}. What would you like to learn about?`);
    } catch (error) {
      console.error('Submission error:', error);
      addMessage('assistant', 'There was an error processing your details. Please try again.');
    }
  }, [validateAll, userDetails]);

  // Add message to chat with timestamp and ID
  const addMessage = useCallback((type, text, model = null) => {
    try {
      const newMessage = {
        type,
        text,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        modelUsed: model
      };

      setChatHistory(prev => [...prev, newMessage]);

      if (type === 'assistant' && settings.autoSpeak) {
        speak(text);
      }
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  }, [settings.autoSpeak, speak]);

  // Generate AI prompt with better structure
  const generatePrompt = useCallback((userInput) => {
    try {
      const baseDetails = `Course: ${userDetails.course}\n` +
        `Subject: ${userDetails.subject}\n` +
        `Year/Semester: ${userDetails.yearSem}\n` +
        `Key Topics: ${userDetails.importantTopics}\n` +
        `Format Preference: ${userDetails.formatPreference}`;

      if (isAdvancedMode) {
        return `Create comprehensive notes on "${userInput}" with these details:
${baseDetails}

Format requirements:
1. Detailed explanation with examples
2. Well-structured Markdown formatting
3. Include diagrams/charts when applicable
4. Use headings, bullet points, and numbered lists
5. Generate 1-2 relevant images (describe them with ALT text)
6. Include key takeaways and summary

Additional instructions:
- Explain concepts thoroughly
- Use analogies for complex topics
- Provide real-world applications
- Include important formulas/theorems with explanations
- Use tables for comparison when helpful
- Provide step-by-step explanations where needed`;
      } else {
        return `Create concise notes on "${userInput}" with these details:
${baseDetails}

Format requirements:
1. Brief bullet points
2. Key concepts only
3. Simple language
4. No images needed`;
      }
    } catch (error) {
      console.error('Prompt generation error:', error);
      return `Create notes on "${userInput}" for ${userDetails.subject}`;
    }
  }, [isAdvancedMode, userDetails]);

  // Handle form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = message;
    addMessage('user', userMessage);
    setMessage('');

    // In tutor mode, a regular message is a general query
    const requestType = isTutorMode ? 'explanation' : '';
    sendQueryToBackend(userMessage, requestType);
  };

  const handleTutorAction = (requestType) => {
    const topic = userDetails.importantTopics;
    if (!topic.trim()) {
      addMessage('assistant', "Please enter a topic in the 'Topic/Query' field first.");
      return;
    }

    // Make the user message more descriptive
    const descriptiveRequest = requestType.replace('_', ' ');
    addMessage('user', `Generate ${descriptiveRequest} for: ${topic}`);
    sendQueryToBackend(topic, requestType);
  };

  const sendQueryToBackend = async (query, requestType = '') => {

    setIsTyping(true);

    try {

      let endpoint = `${process.env.REACT_APP_API_URL}/generate`;

      let requestBody;



      if (isTutorMode) {

        endpoint = `${process.env.REACT_APP_API_URL}/generate/tutor`;



        // Exclude the last message (current user query) from history

        let historyForBackend = chatHistory.slice(0, -1).map(msg => ({

          role: msg.type === 'user' ? 'user' : 'model',

          parts: [{ text: msg.text }]

        }));



        // Find the index of the first user message

        const firstUserIndex = historyForBackend.findIndex(msg => msg.role === 'user');



        // If a user message is found, slice from there, otherwise send empty history

        if (firstUserIndex !== -1) {

          historyForBackend = historyForBackend.slice(firstUserIndex);

        } else {

          historyForBackend = [];

        }



        requestBody = {

          topic: query,

          subject: userDetails.subject || 'General',

          history: historyForBackend,

          requestType: requestType,

          userQuery: query, // The user's most recent message/query
          requestedModel: selectedModel
        };

      } else {

        // Prepare the complete request body for notes generation

        requestBody = {

          query: query,

          subject: userDetails.subject || 'General',

          course: userDetails.course || 'Unknown Course',

          classLevel: userDetails.classLevel || '',

          yearSem: userDetails.yearSem || '',

          importantTopics: userDetails.importantTopics || '',

          formatPreference: userDetails.formatPreference || 'bullet-points',

          advancedMode: isAdvancedMode,

          userId: "current-user-id",
          requestedModel: selectedModel
        };

      }







      const response = await fetch(endpoint, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json'

        },

        body: JSON.stringify(requestBody)

      });



      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Unknown server error' };
        }
        console.error("Backend Error:", errorData);
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }



      const data = await response.json();





      // Defensive check for the response data

      if (data?.data && typeof data.data === 'string') {

        addMessage('assistant', data.data, data.modelUsed);

      } else {

        addMessage('assistant', "❗ I received an empty response. Please try again.");

      }





    } catch (error) {

      addMessage('assistant', `Error: ${error.message}`);

      console.error('API Error Details:', error);

    } finally {

      setIsTyping(false);

    }

  };


  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleAdvancedParse = useCallback(() => {
    if (!advancedInput || typeof advancedInput !== 'string' || !advancedInput.trim()) return;

    try {
      let extractedDetails = {
        course: '',
        subject: '',
        classLevel: '',
        yearSem: '',
        importantTopics: ''
      };

      // 1. Extract Course (same as before)
      const courseMatch = advancedInput.match(/\b(BCA|MCA|BSc|MSc|B\.?Tech|M\.?Tech|BA|MA|BCom|MCom|PhD|BBA|MBA|BE|ME)\b/i);
      if (courseMatch) extractedDetails.course = courseMatch[1].toUpperCase();

      // 2. IMPROVED SUBJECT EXTRACTION
      // First try to find subject after "of" or "for"
      const subjectPatterns = [
        // Pattern for "notes for BCA... of DBMS"
        /(?:notes|generate|create|study|learn)\s+(?:for|about|on)\s+.*?(?:\bof\b)\s+([a-zA-Z\s]+?)(?:\s+(?:for|in|of|about|on|sem|year|level|topics)|$)/i,
        // Pattern for "notes of DBMS for BCA..."
        /(?:notes|generate|create|study|learn)\s+(?:of|about|on)\s+([a-zA-Z\s]+?)(?:\s+(?:for|in|of|about|on|sem|year|level|topics)|$)/i,
        // General pattern for subject at end
        /(?:notes|generate|create|study|learn)\s+(?:of|about|on|for)?\s*([a-zA-Z\s]+)$/i,
        // Pattern for subject at beginning
        /^([a-zA-Z\s]+)\s+(?:notes|study|material)/i
      ];

      for (const pattern of subjectPatterns) {
        const subjectMatch = advancedInput.match(pattern);
        if (subjectMatch && subjectMatch[1]) {
          const potentialSubject = subjectMatch[1].trim();
          // Skip if it matches course or other keywords
          if (!potentialSubject.match(/\b(notes|for|of|about|on|sem|year|level|topics|BCA|MCA|BSc|MSc|B\.?Tech|M\.?Tech)\b/i)) {
            extractedDetails.subject = potentialSubject.replace(/\b\w/g, c => c.toUpperCase());
            break;
          }
        }
      }

      // 3. Extract Level (same as before)
      const levelMap = {
        easy: 'Beginner',
        beginner: 'Beginner',
        medium: 'Intermediate',
        intermediate: 'Intermediate',
        hard: 'Advanced',
        advanced: 'Advanced'
      };

      const levelMatch = advancedInput.match(/\b(easy|medium|hard|beginner|intermediate|advanced)\b/i);
      if (levelMatch) {
        extractedDetails.classLevel = levelMap[levelMatch[1].toLowerCase()] || levelMatch[1];
      }

      // 4. Extract Year/Semester (same as before)
      const yearSemPatterns = [
        /(\d+(?:st|nd|rd|th))\s*year.*?(\d+(?:st|nd|rd|th))\s*sem(?:ester)?/i,
        /(\d+(?:st|nd|rd|th))\s*sem(?:ester)?.*?(\d+(?:st|nd|rd|th))\s*year/i,
        /(\d+(?:st|nd|rd|th)\/\d+(?:st|nd|rd|th))/i,
        /(\d+(?:st|nd|rd|th))\s*year/i,
        /(\d+(?:st|nd|rd|th))\s*sem(?:ester)?/i
      ];

      for (const pattern of yearSemPatterns) {
        const match = advancedInput.match(pattern);
        if (match) {
          if (match[1] && match[2]) {
            extractedDetails.yearSem = `${match[1]}/${match[2]}`;
          } else if (match[1] && pattern.toString().includes('year')) {
            extractedDetails.yearSem = `${match[1]}/`;
          } else if (match[1] && pattern.toString().includes('sem')) {
            extractedDetails.yearSem = `/${match[1]}`;
          }
          break;
        }
      }

      // 5. Extract Important Topics (same as before)
      const topicsPatterns = [
        /(?:important topics are|topics include|covering topics are|including)\s*([a-zA-Z0-9,\s-]+)/i,
        /(?:cover|include)\s*([a-zA-Z0-9,\s-]+?)\s*(?:topics|concepts)/i,
        /(?:focus on|about)\s*([a-zA-Z0-9,\s-]+)/i
      ];

      for (const pattern of topicsPatterns) {
        const topicsMatch = advancedInput.match(pattern);
        if (topicsMatch && topicsMatch[1]) {
          extractedDetails.importantTopics = topicsMatch[1]
            .split(/[,&]| and /)
            .map(topic => topic.trim())
            .filter(topic => topic.length > 0)
            .join(', ');
          break;
        }
      }

      // Final check - if subject not found but "of" exists
      if (!extractedDetails.subject) {
        const ofMatch = advancedInput.match(/\bof\s+([a-zA-Z\s]+?)(?:\s+(?:for|in|about|on|sem|year|level|topics))|$/i);
        if (ofMatch && ofMatch[1]) {
          const potentialSubject = ofMatch[1].trim();
          if (!potentialSubject.match(/\b(notes|for|of|about|on|sem|year|level|topics)\b/i)) {
            extractedDetails.subject = potentialSubject.replace(/\b\w/g, c => c.toUpperCase());
          }
        }
      }

      // Set extracted details in state
      setUserDetails(prev => ({
        ...prev,
        ...extractedDetails,
        course: extractedDetails.course || prev.course,
        subject: extractedDetails.subject || prev.subject,
        classLevel: extractedDetails.classLevel || prev.classLevel,
        yearSem: extractedDetails.yearSem || prev.yearSem,
        importantTopics: extractedDetails.importantTopics || prev.importantTopics
      }));

      // Show success message with what was extracted
      let successMsg = "I've auto-filled these details:";
      if (extractedDetails.course) successMsg += `\n- Course: ${extractedDetails.course}`;
      if (extractedDetails.subject) successMsg += `\n- Subject: ${extractedDetails.subject}`;
      if (extractedDetails.yearSem) successMsg += `\n- Year/Sem: ${extractedDetails.yearSem}`;
      if (extractedDetails.classLevel) successMsg += `\n- Level: ${extractedDetails.classLevel}`;
      if (extractedDetails.importantTopics) successMsg += `\n- Topics: ${extractedDetails.importantTopics}`;

      addMessage('assistant', successMsg);

    } catch (error) {
      console.error("Advanced parsing error:", error);
      addMessage('assistant', "I found some details but please review the form for accuracy.");
    }
  }, [advancedInput, addMessage]);


  // Generate PDF with better error handling and image support
  const generatePDF = async (notes) => {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595, 842]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica).catch(() => pdfDoc.embedFont(StandardFonts.TimesRoman));
      let y = height - 50;
      page.drawText(`${userDetails.subject} Notes`, {
        x: 50,
        y,
        size: 18,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.4),
      });
      y -= 25;

      page.drawText(`${userDetails.course} • ${new Date().toLocaleDateString()}`, {
        x: 50,
        y,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 40;

      // Add images if available
      if (generatedImages.length > 0) {
        for (const img of generatedImages) {
          try {
            const response = await fetch(img.url);
            if (!response.ok) throw new Error('Image fetch failed');

            const imageBytes = await response.arrayBuffer();
            const image = await pdfDoc.embedPng(imageBytes);
            const imgDims = image.scale(0.5);

            if (y - imgDims.height < 50) {
              page = pdfDoc.addPage([595, 842]);
              y = height - 50;
            }

            page.drawImage(image, {
              x: 50,
              y: y - imgDims.height,
              width: imgDims.width,
              height: imgDims.height,
            });

            y -= (imgDims.height + 20);

            // Add image caption
            page.drawText(img.altText || 'Diagram', {
              x: 50,
              y,
              size: 9,
              font,
              color: rgb(0.3, 0.3, 0.3),
            });
            y -= 15;
          } catch (error) {
            console.error('Image error:', error);
            continue; // Skip to next image
          }
        }
      }

      // Process text content
      const sections = notes.split('\n\n').filter(n => n.trim());
      for (const section of sections) {
        const isHeading = section.startsWith('#');
        const fontSize = isHeading ? 14 : 11;
        const currentFont = isHeading ? boldFont : font;
        const text = isHeading ? section.replace(/^#+\s*/, '') : section;

        const lines = await wrapText(text, width - 100, currentFont, fontSize);

        for (const line of lines) {
          if (y < 50) {
            page = pdfDoc.addPage([595, 842]);
            y = height - 50;
          }

          page.drawText(line, {
            x: 50,
            y,
            size: fontSize,
            font: currentFont,
            color: rgb(0, 0, 0),
            maxWidth: width - 100,
          });

          y -= (fontSize + 4);
        }

        y -= (isHeading ? 15 : 10);
      }

      const footerText = `Generated by Nogen AI • Page ${pdfDoc.getPageCount()}`;
      const footerWidth = font.widthOfTextAtSize(footerText, 9);
      page.drawText(footerText, {
        x: (width - footerWidth) / 2,
        y: 30,
        size: 9,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      return await pdfDoc.save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF document');
    }
  };

  // Helper to wrap text with better error handling
  const wrapText = async (text, maxWidth, font, fontSize) => {
    try {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);
      return lines;
    } catch (error) {
      console.error('Text wrapping failed:', error);
      return [text]; // Fallback to original text if wrapping fails
    }
  };

  // Generate DOCX with better error handling
  const generateDOCX = async (notes) => {
    try {
      const children = [];

      children.push(
        new Paragraph({
          text: `${userDetails.subject} Notes`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${userDetails.course}`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: ` • ${userDetails.classLevel || 'All Levels'} • ${userDetails.yearSem || ''}`,
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        })
      );

      // Process text content
      const sections = notes.split('\n\n').filter(n => n.trim());
      for (const section of sections) {
        if (section.startsWith('#')) {
          const headingLevel = section.match(/^#+/)[0].length;
          children.push(
            new Paragraph({
              text: section.replace(/^#+\s*/, ''),
              heading: Math.min(HeadingLevel.HEADING_1 + headingLevel - 1, HeadingLevel.HEADING_5),
              spacing: { after: 200 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [new TextRun({
                text: section,
                size: 22,
              })],
              spacing: { after: 150 },
            })
          );
        }
      }

      children.push(
        new Paragraph({
          text: `Generated by Nogen AI on ${new Date().toLocaleDateString()}`,
          spacing: { before: 300 },
          style: 'footer',
        })
      );

      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: 'footer',
              name: 'Footer',
              run: { size: 20, color: '666666' },
              paragraph: { alignment: 'right' }
            }
          ]
        },
        sections: [{
          properties: {},
          children
        }]
      });

      return await Packer.toBlob(doc);
    } catch (error) {
      console.error('DOCX generation failed:', error);
      throw new Error('Failed to generate Word document');
    }
  };
  //for textarea mic start function 
  let recognitionInstance = null;

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    if (recognitionInstance) {
      recognitionInstance.abort(); // old instance ko close kar
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {

    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAdvancedInput((prev) => prev + ' ' + transcript);

    };

    recognition.onerror = (event) => {
      console.error(" Speech error:", event.error);
      if (event.error === "not-allowed") {
        alert("Mic access not allowed. Please enable it in browser settings.");
      } else if (event.error === "aborted") {
        alert("Mic session was interrupted. Try again.");
      } else {
        alert("Mic error: " + event.error);
      }
    };

    recognition.onend = () => {

      recognitionInstance = null;
    };

    recognition.start();
    recognitionInstance = recognition;
  };




  // Download notes with robust PDF generation and error handling
  const downloadNotes = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // Prepare notes content
      const notes = chatHistory
        .filter(chat => chat.type === 'assistant')
        .map(chat => chat.text)
        .join('\n\n');

      if (!notes.trim()) {
        throw new Error('No notes available to export');
      }

      let blob;
      if (exportFormat === 'pdf') {
        // Enhanced PDF generation with proper error handling
        blob = await generatePDFWithRetry(notes);
      } else {
        blob = await generateDOCX(notes);
      }

      // Sanitize filename
      const fileName = `${userDetails.subject.replace(/[^a-z0-9]/gi, '_')}_notes_${new Date().toISOString().slice(0, 10)
        }.${exportFormat}`;

      // Save file with fallback
      try {
        saveAs(blob, fileName);
      } catch (saveError) {
        console.error('File save error:', saveError);
        // Fallback download method
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Export error:', error);
      addMessage('assistant', `Export failed: ${error.message || 'Please try again.'}`);

      // Specific error messages for common cases
      if (error.message.includes('PDF')) {
        addMessage('assistant', 'Tip: Try exporting as DOCX or reduce the notes length');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced PDF generation with retry logic
  const generatePDFWithRetry = async (content, retries = 2) => {
    try {
      // Using pdf-lib for more reliable PDF generation
      const { PDFDocument, rgb } = await import('pdf-lib');
      const { fontkit } = await import('@pdf-lib/fontkit');

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      // Embed fonts (you'll need to load actual font files)
      const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);

      const page = pdfDoc.addPage([595, 842]); // A4 size
      const { width, height } = page.getSize();

      page.drawText(content, {
        x: 50,
        y: height - 50,
        size: 11,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: 15,
      });

      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      if (retries > 0) {

        return generatePDFWithRetry(content, retries - 1);
      }
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  };

  // DOCX generator example


  // Format message with markdown, XSS protection, and custom tags
  const formatMessage = useCallback((text) => {
    try {
      // Basic XSS protection
      let safeText = text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // ChatGPT-style Code Block Extraction and Replacement
      safeText = safeText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript';
        return `
          <div class="code-block-container">
            <div class="code-block-header">
              <span class="code-lang">${language}</span>
              <button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${code.trim()}\`)">
                <i class="far fa-copy"></i> Copy code
              </button>
            </div>
            <pre class="code-block"><code>${code.trim()}</code></pre>
          </div>
        `;
      });

      // Headings with Sophisticated Styling
      safeText = safeText
        .replace(/^### (.*$)/gim, '<h3 class="notes-h3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="notes-h2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="notes-h1">$1</h1>');

      // Professional Bullet Points
      safeText = safeText
        .replace(/^\s*[\*\-]\s+(.*$)/gim, '<div class="notes-li"><span class="bullet"></span><span class="li-content">$1</span></div>');

      // Custom tag replacements with premium styling
      safeText = safeText
        .replace(/\[TOPIC\](.*?)\[\/TOPIC\]/g, '<div class="ai-topic"><span class="topic-icon">#</span> $1</div>')
        .replace(/\[EXAMPLE\](.*?)\[\/EXAMPLE\]/g, '<div class="ai-example"><div class="badge"><i class="fas fa-flask"></i> Case Study / Example</div><div class="example-content">$1</div></div>')
        .replace(/\[IMPORTANT\](.*?)\[\/IMPORTANT\]/g, '<div class="ai-important"><div class="important-header"><i class="fas fa-exclamation-triangle"></i> Key Insight</div>$1</div>')
        .replace(/\[QUESTION\](.*?)\[\/QUESTION\]/g, '<div class="ai-question"><i class="fas fa-user-graduate"></i> $1</div>')
        .replace(/\[FORMULA\](.*?)\[\/FORMULA\]/g, '<div class="ai-formula"><div class="formula-label">Mathematical Concept</div><div class="formula-body">$1</div></div>');

      // Standard markdown replacements
      return safeText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="notes-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="notes-italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
        .replace(/\n\n/g, '<div class="section-spacer"></div>')
        .replace(/\n/g, '<br>');
    } catch (error) {
      console.error('Message formatting error:', error);
      return text;
    }
  }, []);

  // Toggle speaking with better state management
  const toggleSpeak = useCallback(() => {
    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const lastAssistantMessage = chatHistory
          .filter(chat => chat.type === 'assistant')
          .slice(-1)[0]?.text;

        if (lastAssistantMessage) {
          speak(lastAssistantMessage);
        }
      }
    } catch (error) {
      console.error('Speech toggle failed:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking, chatHistory, speak]);

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value, type } = e.target;

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev.autoSpeak : value
    }));
  };

  const customStyles = `
    /* === ULTIMATE READABLE NOTES DESIGN === */
    
    .assistant-message {
      font-size: 16px;
      line-height: 1.75;
      color: #2d3748;
      padding: 28px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      max-width: 100%;
    }
    .dark .assistant-message {
      color: #f8fafc;
    }
    .dark .assistant-message * {
      color: inherit !important;
    }

    /* Beautiful Headings */
    .notes-h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin: 32px 0 16px;
      padding-bottom: 12px;
      border-bottom: 3px solid #6366f1;
      letter-spacing: -0.03em;
      line-height: 1.3;
    }
    .dark .notes-h1 { color: #ffffff; border-bottom-color: #818cf8; }

    .notes-h2 {
      font-size: 22px;
      font-weight: 600;
      color: #2d3748;
      margin: 28px 0 14px;
      line-height: 1.4;
    }
    .dark .notes-h2 { color: #f8fafc; }

    .notes-h3 {
      font-size: 18px;
      font-weight: 600;
      color: #4a5568;
      margin: 20px 0 10px;
      line-height: 1.4;
    }
    .dark .notes-h3 { color: #e2e8f0; }

    /* Clean Bullet Lists */
    .notes-li {
      display: flex;
      gap: 14px;
      margin-bottom: 10px;
      padding-left: 0;
      line-height: 1.7;
    }
    .notes-li .bullet {
      width: 6px;
      height: 6px;
      background: #6366f1;
      border-radius: 50%;
      margin-top: 11px;
      flex-shrink: 0;
    }
    .dark .notes-li .bullet {
      background: #818cf8;
    }
    .notes-li .li-content {
      flex: 1;
    }

    .notes-bold {
      font-weight: 600;
      color: #1a202c;
    }
    .dark .notes-bold { color: #ffffff; }

    .notes-italic {
      font-style: italic;
      color: #4a5568;
    }
    .dark .notes-italic { color: #cbd5e1; }

    .section-spacer {
      height: 20px;
    }

    /* === BEAUTIFUL COLOR-CODED SECTIONS === */
    
    /* Topic Highlight */
    .ai-topic {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      padding: 16px 20px;
      border-radius: 12px;
      border-left: 5px solid #6366f1;
      margin: 28px 0 16px;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
      color: #4338ca;
      font-weight: 600;
      font-size: 17px;
    }
    .dark .ai-topic {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%);
      color: #c7d2fe !important;
      border-left-color: #818cf8;
    }
    .ai-topic .topic-icon {
      background: #6366f1;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      margin-right: 12px;
    }
    .dark .ai-topic .topic-icon {
      background: #818cf8;
    }

    /* Example Box */
    .ai-example {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #86efac;
      border-radius: 14px;
      padding: 24px;
      margin: 24px 0;
      box-shadow: 0 2px 12px rgba(16, 185, 129, 0.08);
      color: #065f46;
    }
    .dark .ai-example {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%);
      border-color: rgba(52, 211, 153, 0.4);
      color: #d1fae5 !important;
    }
    .ai-example .badge {
      background: #10b981;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .dark .ai-example .badge {
      background: #34d399;
      color: #064e3b;
    }
    .ai-example .example-content {
      color: inherit;
      line-height: 1.7;
    }

    /* Important/Key Insight */
    .ai-important {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 2px solid #fcd34d;
      border-radius: 14px;
      padding: 20px 24px;
      margin: 24px 0;
      box-shadow: 0 2px 12px rgba(245, 158, 11, 0.08);
      color: #78350f;
    }
    .dark .ai-important {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%);
      border-color: rgba(251, 191, 36, 0.4);
      color: #fef3c7 !important;
    }
    .important-header {
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d97706;
      letter-spacing: 0.5px;
    }
    .dark .important-header {
      color: #fbbf24 !important;
    }

    /* Question Box */
    .ai-question {
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      border: 2px dashed #c084fc;
      border-radius: 14px;
      padding: 20px 24px;
      margin: 24px 0;
      color: #6b21a8;
      font-style: italic;
      box-shadow: 0 2px 12px rgba(168, 85, 247, 0.08);
    }
    .dark .ai-question {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.06) 100%);
      color: #e9d5ff !important;
      border-color: rgba(192, 132, 252, 0.4);
    }

    /* Formula Box */
    .ai-formula {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #7dd3fc;
      padding: 24px;
      border-radius: 14px;
      margin: 24px 0;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
    }
    .dark .ai-formula {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-color: #475569;
    }
    .formula-label {
      color: #94a3b8;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 12px;
      border-bottom: 1px solid #334155;
      padding-bottom: 8px;
      letter-spacing: 1px;
    }
    .dark .formula-label {
      color: #cbd5e1;
      border-bottom-color: #475569;
    }
    .formula-body {
      font-size: 18px;
      text-align: center;
      padding: 12px 0;
      color: #7dd3fc;
    }
    .dark .formula-body {
      color: #bae6fd;
    }
    
    /* === CODE BLOCKS === */
    .code-block-container {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      margin: 24px 0;
      background: #1e293b;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .dark .code-block-container {
      border-color: #475569;
      background: #0f172a;
    }
    .code-block-header {
      background: #0f172a;
      border-bottom: 1px solid #334155;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dark .code-block-header {
      background: #020617;
      border-bottom-color: #475569;
    }
    .code-lang {
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .dark .code-lang {
      color: #cbd5e1;
    }
    .copy-code-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .copy-code-btn:hover {
      background: #334155;
      color: #e2e8f0;
    }
    .dark .copy-code-btn:hover {
      background: #475569;
      color: #f8fafc;
    }
    .code-block {
      padding: 20px;
      overflow-x: auto;
      color: #e2e8f0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      background: #1e293b;
    }
    .dark .code-block {
      background: #0f172a;
      color: #f1f5f9;
    }
    
    .inline-code {
      background: #f1f5f9;
      color: #dc2626;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #e2e8f0;
    }
    .dark .inline-code {
      background: #1e293b;
      color: #fca5a5;
      border-color: #475569;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="ai-assistant-page">
        <div className="container">
          <div className="assistant-layout">
            <div className="layout-sidebar">
              <motion.div
                className="assistant-sidebar"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="sidebar-header">
                  <h2><i className="fas fa-brain"></i> Nogen AI</h2>
                  <p className="sidebar-tagline">Academic Intelligence Redefined</p>
                  <div className="mode-toggles">
                    <div className="mode-toggle">
                      <span className={!isAdvancedMode ? 'active' : ''}>Basic</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isAdvancedMode}
                          onChange={() => setIsAdvancedMode(!isAdvancedMode)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className={isAdvancedMode ? 'active' : ''}>Advanced</span>
                    </div>
                    <div className="mode-toggle">
                      <span className={!isTutorMode ? 'active' : ''}>Notes</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isTutorMode}
                          onChange={() => setIsTutorMode(!isTutorMode)}
                        />
                        <span className="slider tutor"></span>
                      </label>
                      <span className={isTutorMode ? 'active' : ''}>Tutor</span>
                    </div>

                    <div className="model-selector-container">
                      <label>AI Model Intelligence</label>
                      <select
                        className="model-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Most Intelligent)</option>
                        <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Fast & Reliable)</option>
                        <option value="mixtral-8x7b-32768">Mixtral 8x7B (Balanced)</option>
                        <option value="llama3-8b-8192">Llama 3 8B (Super Fast)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetailsForm ? (
                    <motion.div
                      className="details-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3>Enter Your Details</h3>

                      {/* Advanced Input Section - Only shown when advanced mode is on */}
                      {isAdvancedMode && (
                        <motion.div
                          className="advanced-input-container"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group full-width">
                            <label>
                              <i className="fas fa-magic"></i> Describe what you need
                              <span className="hint">(I'll auto-fill the form below)</span>
                            </label>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <textarea
                                value={advancedInput}
                                onChange={(e) => setAdvancedInput(e.target.value)}
                                placeholder="Example: generate notes of numerical method for BCA 2nd semester"
                                rows={3}
                                style={{ flex: 1 }}
                              />
                              <button
                                type="button"
                                onClick={toggleListening}
                                className="mic-btn"
                                title="Speak your query"
                              >
                                🎤
                              </button>
                            </div>

                            <div className="advanced-actions">
                              <button
                                type="button"
                                className="parse-btn"
                                onClick={handleAdvancedParse}
                                disabled={!advancedInput.trim()}
                              >
                                <i className="fas fa-sparkles"></i> Auto-Fill Form
                              </button>
                              <button
                                type="button"
                                className="example-btn"
                                onClick={() => setAdvancedInput("generate notes of numerical method for BCA 2nd sem")}
                              >
                                <i className="fas fa-lightbulb"></i> Load Example
                              </button>
                            </div>
                          </div>
                          <div className="divider"></div>
                        </motion.div>
                      )}


                      <div className="form-grid">
                        <div className="form-group">
                          <label>Course/Program*</label>
                          <input
                            type="text"
                            name="course"
                            value={userDetails.course}
                            onChange={handleDetailChange}
                            className={errors.course ? 'error' : ''}
                          />
                          {errors.course && <span className="error-message">{errors.course}</span>}
                        </div>

                        <div className="form-group">
                          <label>Subject*</label>
                          <input
                            type="text"
                            name="subject"
                            value={userDetails.subject}
                            onChange={handleDetailChange}
                            className={errors.subject ? 'error' : ''}
                          />
                          {errors.subject && <span className="error-message">{errors.subject}</span>}
                        </div>
                        <div className="form-group">
                          <label>Class Level</label>
                          <input
                            type="text"
                            name="classLevel"
                            value={userDetails.classLevel}
                            onChange={handleDetailChange}
                            className={errors.classLevel ? 'error' : ''}
                          />
                          {errors.classLevel && <span className="error-message">{errors.classLevel}</span>}
                        </div>

                        <div className="form-group">
                          <label>Year/Semester (e.g., 2nd/4th)</label>
                          <input
                            type="text"
                            name="yearSem"
                            value={userDetails.yearSem}
                            onChange={handleDetailChange}
                            className={errors.yearSem ? 'error' : ''}
                            placeholder="e.g., 2nd/4th"
                          />
                          {errors.yearSem && <span className="error-message">{errors.yearSem}</span>}
                        </div>

                        <div className="form-group full-width">
                          <label>Topic/Query</label>
                          <textarea
                            name="importantTopics"
                            value={userDetails.importantTopics}
                            onChange={handleDetailChange}
                            placeholder="e.g., What is photosynthesis?"
                          />
                        </div>

                        {!isTutorMode && <div className="form-group full-width">
                          <label>Format Preference</label>
                          <select
                            name="formatPreference"
                            value={userDetails.formatPreference}
                            onChange={handleDetailChange}
                          >
                            <option value="bullet-points">Bullet Points</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="outline">Outline</option>
                            <option value="qna">Q&A Format</option>
                          </select>
                        </div>}
                      </div>

                      <motion.button
                        className="submit-details-btn"
                        onClick={submitUserDetails}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={Object.values(errors).some(err => err) ||
                          !userDetails.course ||
                          !userDetails.subject}
                      >
                        Start Session
                      </motion.button>
                    </motion.div>
                  ) : (
                    <>
                      {isTutorMode ? (
                        <motion.div
                          className="quick-actions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3>Tutor Actions</h3>
                          <div className="action-buttons">
                            <button onClick={() => handleTutorAction('key_concepts')}>
                              <i className="fas fa-lightbulb"></i> Key Concepts
                            </button>
                            <button onClick={() => handleTutorAction('summary')}>
                              <i className="fas fa-book"></i> Summary
                            </button>
                            <button onClick={() => handleTutorAction('formulas')}>
                              <i className="fas fa-square-root-alt"></i> Formulas
                            </button>
                            <button onClick={() => handleTutorAction('exam_prep')}>
                              <i className="fas fa-graduation-cap"></i> Exam Prep
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="quick-actions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3>Quick Prompts</h3>
                          <div className="action-buttons">
                            <button onClick={() => setMessage(`Explain key concepts in ${userDetails.subject}`)}>
                              <i className="fas fa-lightbulb"></i> Key Concepts
                            </button>
                            <button onClick={() => setMessage(`Create summary of ${userDetails.subject} syllabus`)}>
                              <i className="fas fa-book"></i> Syllabus Summary
                            </button>
                            <button onClick={() => setMessage(`Important formulas in ${userDetails.subject}`)}>
                              <i className="fas fa-square-root-alt"></i> Formulas
                            </button>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        className="download-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="format-selector">
                          <motion.button
                            className={`format-btn ${exportFormat === 'pdf' ? 'active' : ''}`}
                            onClick={() => setExportFormat('pdf')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <i className="fas fa-file-pdf"></i> PDF
                          </motion.button>
                          <motion.button
                            className={`format-btn ${exportFormat === 'docx' ? 'active' : ''}`}
                            onClick={() => setExportFormat('docx')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <i className="fas fa-file-word"></i> Word
                          </motion.button>
                        </div>

                        <motion.button
                          className="download-btn"
                          onClick={downloadNotes}
                          disabled={chatHistory.length <= 1 || isExporting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isExporting ? (
                            <><i className="fas fa-spinner fa-spin"></i> Exporting...</>
                          ) : (
                            <><i className="fas fa-download"></i> Download Notes</>
                          )}
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="layout-main">
              <motion.div
                className="chat-container"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="chat-header">
                  <div className="header-user">
                    <div className="header-avatar">
                      <i className="fas fa-brain"></i>
                    </div>
                    <div className="header-info">
                      <h4>Nogen AI Assistant</h4>
                      <p><i className="fas fa-circle"></i> Always Active</p>
                    </div>
                  </div>
                  <div className="header-actions">
                    <button className="mic-btn" onClick={toggleListening} title="Voice Input">
                      <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                    </button>
                    {showQuizButton && (
                      <motion.button
                        className="quiz-btn"
                        onClick={() => navigate('/quiz')}
                        style={{ marginTop: 0, marginLeft: '10px' }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <i className="fas fa-graduation-cap"></i> Practice Quiz
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="chat-messages" id="chat-messages">
                  <AnimatePresence>
                    {chatHistory.map((chat) => (
                      <motion.div
                        key={chat.id}
                        className={`message ${chat.type}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {chat.type === 'assistant' && (
                          <div className="header-avatar" style={{ width: '32px', height: '32px', fontSize: '1rem', flexShrink: 0 }}>
                            <i className="fas fa-robot"></i>
                          </div>
                        )}
                        <div className="message-content">
                          {chat.type === 'assistant' ? (
                            <div className="assistant-message">
                              <div className="message-text" dangerouslySetInnerHTML={{
                                __html: formatMessage(chat.text)
                              }} />

                              {/* Display generated images for this message */}
                              {generatedImages.length > 0 && chat.id === chatHistory[chatHistory.length - 1].id && (
                                <div className="generated-images">
                                  {generatedImages.map((img, index) => (
                                    <img
                                      key={index}
                                      src={img.url}
                                      alt={img.altText || 'Generated diagram'}
                                      className="note-image"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="message-timestamp" style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.6 }}>
                                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ) : (
                            <>
                              <p>{chat.text}</p>
                              <div className="message-timestamp">
                                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      className="message assistant typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="message-avatar">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          />
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          />
                          <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* //button show quize 

              <button onClick={() => setShowQuiz(true)} className="start-quiz-btn">
                Start Quiz
              </button> */}


                {!showDetailsForm && (
                  <motion.form
                    className="chat-input"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="input-wrapper">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message Nogen AI about ${userDetails.subject || 'your studies'}...`}
                        disabled={isTyping}
                      />
                      <motion.button
                        type="submit"
                        className="send-btn"
                        disabled={!message.trim() || isTyping}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isTyping ? (
                          <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                          <i className="fas fa-arrow-up"></i>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default AiAssistant;