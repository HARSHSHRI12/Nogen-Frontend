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
      text: 'Hello! I\'m your Quick Notes AI assistant. Please fill in your details to get started.',
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
  //for quize 
  const [showQuiz, setShowQuiz] = useState(false);
 const [showQuizButton, setShowQuizButton] = useState(false); // Show quiz button ke liye state
const [quizQuestions, setQuizQuestions] = useState([]);

useEffect(() => {
  if (messages.some((m) => m.role === 'assistant')) {
    setShowQuizButton(true);
  }
}, [messages]);

  
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
    console.log('Quiz Completed!', result);
    // You can show the result or store it in the backend
  };

  const submitQuizResult = async (result) => {
    console.log('Quiz Result Submitted!', result);
    // Add API call to submit quiz result to backend
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
      console.error('Failed to initialize speech recognition:', error);
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

  {showQuizButton && (
    <motion.div
      className="chat-header"
      onClick={() => navigate('/quiz')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      Start Quiz
    </motion.div>
  )}

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
  const addMessage = useCallback((type, text) => {
    try {
      const newMessage = { 
        type, 
        text,
        timestamp: new Date().toISOString(),
        id: Date.now()
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

  addMessage('user', message);
  setMessage('');
  setIsTyping(true);

  try {
    // Prepare the complete request body
    const requestBody = {
      query: message,
      subject: userDetails.subject || 'General',
      course: userDetails.course || 'Unknown Course',
      classLevel: userDetails.classLevel || '',
      yearSem: userDetails.yearSem || '',
      importantTopics: userDetails.importantTopics || '',
      formatPreference: userDetails.formatPreference || 'bullet-points',
      advancedMode: isAdvancedMode,
      userId: "current-user-id"
    };

    console.log(" Sending request with:", requestBody);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(" Backend validation errors:", errorData.errors);
      throw new Error(errorData.errors?.[0]?.msg || 'Request failed');
    }

    const data = await response.json();
    console.log(" API Response:", data);

    // Defensive check for notes
    if (data?.data && typeof data.data === 'string') {
      addMessage('assistant', data.data);
    } else {
      addMessage('assistant', "❗ No notes were returned. Please try again.");
    }
    

  } catch (error) {
    addMessage('assistant', ` Error: ${error.message}`);
    console.error(' API Error Details:', error);
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
    console.log(" Listening...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setAdvancedInput((prev) => prev + ' ' + transcript);
    console.log(" You said:", transcript);
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
    console.log(" Mic session ended.");
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
    const fileName = `${userDetails.subject.replace(/[^a-z0-9]/gi, '_')}_notes_${
      new Date().toISOString().slice(0,10)
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
      console.log(`Retrying PDF generation (${retries} attempts left)`);
      return generatePDFWithRetry(content, retries - 1);
    }
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// DOCX generator example


  // Format message with markdown and XSS protection
  const formatMessage = useCallback((text) => {
    try {
      // Basic XSS protection
      const safeText = text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      return safeText
        .replace(/^# (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h4>$1</h4>')
        .replace(/^### (.*$)/gm, '<h5>$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
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

  return (

    //for Quiz 

    
    //previous logic
    <div className="ai-assistant-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <motion.div 
              className="assistant-sidebar"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sidebar-header">
                <h2><i className="fas fa-robot"></i> Quick Notes AI</h2>
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
          onClick={startListening}
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
          <label>Important Topics (comma separated)</label>
          <textarea
            name="importantTopics"
            value={userDetails.importantTopics}
            onChange={handleDetailChange}
            placeholder="e.g., Calculus, Thermodynamics, Organic Chemistry"
          />
        </div>
        
        <div className="form-group full-width">
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
        </div>
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
                      Start Note Taking
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
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

          <div className="col-lg-8">
            <motion.div 
              className="chat-container"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="chat-header">
                <div className="assistant-info">
                  <div className="assistant-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="assistant-details">
                    <h3>{userDetails.subject || 'Quick Notes'} Assistant</h3>
                    <p className={`mode-indicator ${isAdvancedMode ? 'advanced' : 'basic'}`}>
                      {isAdvancedMode ? 'Advanced Mode' : 'Basic Mode'}
                    </p>
                  </div>
                </div>
                <div className="chat-actions">
                  <motion.button 
                    className="action-btn"
                    onClick={toggleSpeak}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-volume-up'}`}></i>
                  </motion.button>
                  
                  <motion.button 
                    className="action-btn"
                    onClick={toggleListening}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                  </motion.button>
                  
                  <motion.button 
                    className="action-btn"
                    onClick={() => setShowSettings(!showSettings)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Settings"
                  >
                    <i className="fas fa-cog"></i>
                  </motion.button>
                  
                  {!showDetailsForm && (
                    <motion.button 
                      className="action-btn"
                      onClick={() => setShowDetailsForm(true)}
                      whileHover={{ rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit Details"
                    >
                      <i className="fas fa-user-edit"></i>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    className="settings-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3>Settings</h3>
                    
                    <div className="setting-group">
                      <label>Speech Rate</label>
                      <input
                        type="range"
                        name="speechRate"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.speechRate}
                        onChange={handleSettingsChange}
                      />
                      <span>{settings.speechRate}x</span>
                    </div>
                    
                    <div className="setting-group">
                      <label>Speech Pitch</label>
                      <input
                        type="range"
                        name="speechPitch"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.speechPitch}
                        onChange={handleSettingsChange}
                      />
                      <span>{settings.speechPitch}x</span>
                    </div>
                    
                    <div className="setting-group">
                      <label>
                        <input
                          type="checkbox"
                          name="autoSpeak"
                          checked={settings.autoSpeak}
                          onChange={handleSettingsChange}
                        />
                        Auto-read messages
                      </label>
                    </div>
                    
                    <div className="setting-group">
                      <label>Theme</label>
                      <select
                        name="theme"
                        value={settings.theme}
                        onChange={handleSettingsChange}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="chat-messages">
                <AnimatePresence>
                  {chatHistory.map((chat) => (
                    <motion.div
                      key={chat.id}
                      className={`message ${chat.type}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: chat.type === 'user' ? 50 : -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      {chat.type === 'assistant' && (
                        <div className="message-avatar">
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
                          {/*  Show this button only if notes are generated */}
                        {messages.some((m) => m.role === 'assistant') && (
                          <button onClick={generateNotesAndQuiz} className="quiz-btn">
                             Take Quiz Based on These Notes
                          </button>
                        )}

                        {/*  Show "Start Quiz" button only after notes are generated */}
                        {showQuizButton && (
                          <motion.div
                            className="chat-header"
                            onClick={() => navigate('/quiz')} // Navigate to Quiz page
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Start Quiz
                          </motion.div>
                        )}
                      


                            
                            <div className="message-timestamp">
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
                  <div className="input-container">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask me anything about ${userDetails.subject}...`}
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
                        <motion.i 
                          className="fas fa-paper-plane"
                          whileHover={{ rotate: 15 }}
                        />
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;