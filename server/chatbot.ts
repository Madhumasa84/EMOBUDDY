import nlp from 'compromise';

// Conversation patterns and responses
const patterns = [
  {
    // Greetings
    pattern: '(hi|hello|hey|good morning|good afternoon|good evening|what\'s up|howdy)',
    responses: [
      "Hello! How are you feeling today?",
      "Hi there! I'm EmoBuddy. How can I help you today?",
      "Hello! It's nice to connect with you. How are you doing?",
      "Hey there! How's your day going so far?",
      "Hi! I'm here to listen. How are you feeling at the moment?"
    ],
    emotion: 'friendly'
  },
  {
    // Wellness recommendations
    pattern: '(recommend|suggest|advice|help me feel better|need help|what should I do|how to improve|tips)',
    responses: [
      "I'd recommend trying some of these positive activities: 1) Take a 15-minute walk outside in nature, 2) Practice deep breathing for 5 minutes, 3) Call a supportive friend or family member, 4) Eat a nutritious meal with plenty of vegetables and protein, 5) Write down three things you're grateful for today.",
      "Here are some science-backed activities that can help: 1) Meditate for just 10 minutes, 2) Get some physical exercise - even a short walk helps, 3) Connect with a friend or family member, 4) Spend time in nature, 5) Ensure you're eating regular, nutritious meals with plenty of fruits and vegetables.",
      "I'd suggest these mood-boosting activities: 1) Physical movement - try a quick walk or stretching, 2) Social connection - reach out to someone who makes you feel good, 3) Mindfulness - take a few minutes to focus on your breathing, 4) Healthy eating - make sure you're nourishing your body with balanced meals, 5) Gratitude practice - reflect on what's going well in your life.",
      "Some positive activities you might try: 1) Get outside for some fresh air and a walk, 2) Call a friend or family member for a chat, 3) Practice meditation or deep breathing, 4) Make sure you're eating regular, balanced meals, 5) Do something creative like drawing, writing, or making music.",
      "I'd recommend these evidence-based approaches: 1) Physical activity - even a short walk can boost your mood, 2) Social connection - reach out to supportive friends or family, 3) Mindfulness meditation - try a guided session, 4) Nutritious eating - fuel your body with healthy foods, 5) Sleep hygiene - aim for 7-9 hours of quality sleep."
    ],
    emotion: 'encouraging'
  },
  {
    // Feeling good
    pattern: '(good|great|excellent|amazing|wonderful|fantastic|happy|joy|excited|positive)',
    responses: [
      "That's wonderful to hear! What's been contributing to your positive feelings?",
      "I'm so glad you're feeling good! Remember this feeling and what led to it.",
      "That's excellent! Is there something specific that made your day better?",
      "I'm happy to hear you're doing well! It's important to acknowledge and celebrate the good moments.",
      "Wonderful! Positive emotions are worth cherishing. What are you looking forward to?"
    ],
    emotion: 'happy'
  },
  {
    // Feeling bad
    pattern: '(bad|terrible|awful|unhappy|sad|depressed|down|blue|upset|worried|anxious|stressed|overwhelmed)',
    responses: [
      "I'm sorry to hear you're not feeling great. Would you like to talk more about what's troubling you?",
      "It sounds like you're going through a difficult time. Remember that it's okay to feel this way sometimes.",
      "I hear that you're struggling right now. Taking time to acknowledge these feelings is an important step.",
      "I'm here for you during this difficult time. What do you think might help you feel a bit better right now?",
      "That sounds really challenging. Would it help to explore some coping strategies together?"
    ],
    emotion: 'sad'
  },
  {
    // Anxiety
    pattern: '(anxious|anxiety|nervous|worry|worried|panic|stressed|stress|tension|uneasy|restless)',
    responses: [
      "Anxiety can be really overwhelming. Have you tried any breathing exercises? Taking slow, deep breaths can help reduce anxiety in the moment.",
      "I understand how difficult anxiety can be. Would it help to focus on something specific that's causing your anxiety?",
      "Anxiety is a normal response to stress, but it can be very uncomfortable. What helps you feel grounded when you're anxious?",
      "I hear that you're feeling anxious. Sometimes it helps to focus on what's in your control right now. Is there a small step you could take?",
      "When anxiety takes over, it can help to engage your senses. Could you try noticing 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste?"
    ],
    emotion: 'anxious'
  },
  {
    // Anger
    pattern: '(angry|anger|mad|frustrated|annoyed|irritated|furious|rage|resentment|bitter)',
    responses: [
      "I can hear the frustration in your message. Would it help to talk more about what's making you feel this way?",
      "Anger is often a signal that something important to us is being threatened or violated. What do you think might be behind your anger?",
      "It's normal to feel angry sometimes. Have you found any healthy ways to express or release your anger?",
      "Feeling angry can be really intense. Sometimes taking a short break or time-out can help when emotions are running high.",
      "I understand you're feeling frustrated. Is there a specific situation or person that's triggering these feelings?"
    ],
    emotion: 'angry'
  },
  {
    // Need for connection
    pattern: '(lonely|alone|isolated|disconnected|no friends|no one cares|no one understands)',
    responses: [
      "Feeling lonely can be really painful. Even though I'm just a chatbot, I'm here to listen and support you.",
      "It sounds like you're feeling isolated right now. Have there been people in your life who you've felt connected to in the past?",
      "The feeling of disconnection can be very difficult. Are there any small ways you might reach out to others?",
      "I'm sorry you're feeling lonely. Sometimes even brief interactions, like saying hello to a neighbor or calling a family member, can help reduce that feeling.",
      "Social connection is a basic human need. Are there any groups or activities related to your interests where you might meet like-minded people?"
    ],
    emotion: 'supportive'
  },
  {
    // Gratitude and positivity
    pattern: '(grateful|thankful|appreciate|blessed|lucky|fortune|wonderful)',
    responses: [
      "Practicing gratitude is a powerful way to boost wellbeing. What other things are you grateful for today?",
      "It's wonderful that you're focusing on the positive aspects of your life. That perspective can be really helpful during challenging times.",
      "Gratitude is linked to increased happiness and wellbeing. Is this something you practice regularly?",
      "I'm glad you're recognizing the good things in your life. Sometimes writing them down can help reinforce those positive feelings.",
      "That's a beautiful perspective. Recognizing the good things, even small ones, can really brighten our outlook."
    ],
    emotion: 'grateful'
  },
  {
    // Seeking advice
    pattern: '(advice|suggestion|help me|what should I do|how can I|need guidance)',
    responses: [
      "I'd be happy to explore this with you. Could you tell me more about the specific situation you're seeking advice on?",
      "Sometimes talking through a problem can help clarify our thoughts. What options have you already considered?",
      "I'm here to help you think things through. What outcome would you ideally like to see in this situation?",
      "It can be helpful to weigh the pros and cons of different choices. Would you like to explore that approach?",
      "I appreciate you reaching out for guidance. What values or priorities feel important to consider in this decision?"
    ],
    emotion: 'thoughtful'
  },
  {
    // Self-improvement
    pattern: '(improve|better|growth|learn|develop|change|goals|progress)',
    responses: [
      "It's great that you're focused on personal growth. What specific areas would you like to develop?",
      "Setting goals for self-improvement can be very motivating. What small step could you take today toward one of your goals?",
      "Personal development is a journey, not a destination. What progress have you already made that you're proud of?",
      "I admire your commitment to growth. Remember that change often happens gradually, and small consistent efforts can lead to big results.",
      "It's wonderful that you're investing in yourself. What support or resources might help you in your development journey?"
    ],
    emotion: 'encouraging'
  },
  {
    // Sleep issues
    pattern: '(sleep|insomnia|tired|exhausted|fatigue|rest|can\'t sleep|trouble sleeping)',
    responses: [
      "Sleep difficulties can have a big impact on how we feel. Have you noticed any patterns or factors that seem to affect your sleep?",
      "Establishing a consistent bedtime routine can help signal to your body that it's time to wind down. What does your current routine look like?",
      "I'm sorry to hear you're struggling with sleep. Some people find that limiting screen time before bed and creating a cool, dark environment can help.",
      "Sleep is so important for our mental and physical wellbeing. Have you spoken with a healthcare provider about your sleep challenges?",
      "Feeling tired can make everything else more difficult. Some find relaxation techniques like progressive muscle relaxation or guided imagery helpful for sleep."
    ],
    emotion: 'concerned'
  },
  {
    // Work stress
    pattern: '(work|job|boss|coworker|career|workplace|office|profession|employment)',
    responses: [
      "Work can be a significant source of stress. What aspects of your job are you finding most challenging right now?",
      "Maintaining work-life balance is important but often difficult. How are you taking care of yourself outside of work hours?",
      "Workplace dynamics can be complicated. Is there a specific situation or relationship at work that's troubling you?",
      "Many people find that setting boundaries at work helps reduce stress. Is that something you've been able to do?",
      "It sounds like work is on your mind. What would make your work situation feel more manageable or fulfilling?"
    ],
    emotion: 'thoughtful'
  },
  {
    // Family relationships
    pattern: '(family|parent|mother|father|sibling|brother|sister|relative|in-laws)',
    responses: [
      "Family relationships can be both rewarding and challenging. How are you feeling about your family interactions?",
      "Family dynamics often have deep roots in our past. Have these patterns been present for a long time?",
      "It sounds like family is on your mind. Is there a specific situation or conversation that's concerning you?",
      "Sometimes setting boundaries with family members can be particularly difficult. Is that something you're struggling with?",
      "Our relationships with family members can have a big impact on our wellbeing. What would an ideal relationship with your family look like?"
    ],
    emotion: 'understanding'
  },
  {
    // Crisis indicators (self-harm, suicide)
    pattern: '(kill myself|suicide|end it all|self harm|hurt myself|no reason to live|better off dead|can\'t go on)',
    responses: [
      "I'm concerned about what you're sharing. These feelings are serious, and it's important to talk to someone who can help. Please consider calling a crisis line like the National Suicide Prevention Lifeline at 1-800-273-8255 or texting HOME to 741741 to reach the Crisis Text Line.",
      "I hear that you're in a lot of pain right now. Your life matters, and there are people who want to help. Please reach out to a mental health professional or call 1-800-273-8255 to speak with someone immediately.",
      "I'm really worried about you. These thoughts deserve immediate attention from a trained professional. Please call a crisis line like 1-800-273-8255 or go to your nearest emergency room.",
      "What you're experiencing sounds very difficult, and I'm concerned for your safety. These feelings are often temporary, and help is available. Please call 1-800-273-8255 or text HOME to 741741 for immediate support.",
      "I'm sorry you're feeling this way. It's important that you talk to someone who can provide immediate help. Please call 1-800-273-8255 or reach out to a trusted person in your life right now."
    ],
    emotion: 'concerned',
    isCrisis: true
  },
  {
    // Relationship issues
    pattern: '(relationship|boyfriend|girlfriend|partner|spouse|husband|wife|dating|marriage|breakup|divorce)',
    responses: [
      "Relationships can bring both joy and challenges. What aspects of your relationship are on your mind?",
      "It sounds like you're thinking about your relationship. Is there a specific situation or pattern that's concerning you?",
      "Relationship dynamics can be complex. How have you been communicating about these issues with your partner?",
      "It can be helpful to identify what's working well in a relationship, as well as the areas that need attention. What positives do you see?",
      "Navigating relationships requires ongoing effort and communication. What would you like to see change or improve?"
    ],
    emotion: 'empathetic'
  },
  {
    // General uncertainty or confusion
    pattern: '(confused|unsure|uncertain|don\'t know|not sure|lost|wondering)',
    responses: [
      "It's okay to feel uncertain sometimes. Would it help to talk through what's causing the confusion?",
      "Feeling unsure can be uncomfortable, but it's also a normal part of life. What options are you considering?",
      "When we're faced with uncertainty, sometimes it helps to focus on what we do know for sure. What feels clear to you right now?",
      "It sounds like you're in a period of uncertainty. Taking things one step at a time can sometimes help make things feel more manageable.",
      "I understand that feeling confused or lost can be difficult. Would it help to break down the situation into smaller pieces?"
    ],
    emotion: 'supportive'
  },
  {
    // Thanks or appreciation
    pattern: '(thank you|thanks|appreciate it|grateful|helpful)',
    responses: [
      "You're very welcome! I'm here anytime you want to talk.",
      "I'm glad I could help. Remember that I'm here whenever you need someone to talk to.",
      "You're welcome! Is there anything else on your mind that you'd like to discuss?",
      "I'm happy to be here for you. How are you feeling now?",
      "It's my pleasure to support you. Remember you can come back anytime you need to talk."
    ],
    emotion: 'grateful'
  },
  {
    // Default response
    pattern: '.*',
    responses: [
      "I'm here to listen. Could you tell me more about how you're feeling?",
      "Thank you for sharing that with me. Would you like to explore this topic further?",
      "I appreciate you opening up. How has this been affecting you?",
      "I'm interested in understanding more about your experience. Would you like to continue talking about this?",
      "I'm here to support you. Is there anything specific about this situation that's been on your mind?"
    ],
    emotion: 'supportive'
  }
];

// Emotion detection patterns
const emotionPatterns = [
  {
    emotion: 'happy',
    label: 'Happy',
    pattern: '(happy|joy|joyful|excited|thrilled|delighted|pleased|content|cheerful|good|great|excellent|wonderful|amazing|fantastic|terrific|elated|jubilant|optimistic|positive)',
    intensity: 4,
    color: '#FCD34D'
  },
  {
    emotion: 'sad',
    label: 'Sad',
    pattern: '(sad|unhappy|depressed|down|blue|gloomy|miserable|somber|melancholy|heartbroken|grief|despair|disappointed|discouraged|hopeless|pessimistic|sorrowful|tearful)',
    intensity: 3,
    color: '#93C5FD'
  },
  {
    emotion: 'angry',
    label: 'Angry',
    pattern: '(angry|mad|furious|irritated|annoyed|frustrated|enraged|hostile|bitter|resentful|outraged|incensed|indignant|irate|livid|fuming|raging|infuriated)',
    intensity: 4,
    color: '#F87171'
  },
  {
    emotion: 'anxious',
    label: 'Anxious',
    pattern: '(anxious|worried|nervous|tense|stressed|afraid|fearful|scared|panicked|apprehensive|uneasy|concerned|distressed|overwhelmed|troubled|alarmed|terrified|dread)',
    intensity: 4,
    color: '#A78BFA'
  },
  {
    emotion: 'calm',
    label: 'Calm',
    pattern: '(calm|peaceful|relaxed|tranquil|serene|composed|centered|balanced|still|quiet|restful|harmonious|placid|gentle|soothing|comfortable|at ease|chill|mellow)',
    intensity: 2,
    color: '#6EE7B7'
  },
  {
    emotion: 'neutral',
    label: 'Neutral',
    pattern: '(neutral|okay|fine|alright|so-so|normal|average|moderate|indifferent|impartial|dispassionate|detached|uninvolved|fair|balanced)',
    intensity: 3,
    color: '#9CA3AF'
  }
];

// Crisis pattern keywords
const crisisPatterns = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'better off dead',
  'no reason to live',
  'can\'t go on',
  'ending it all',
  'hurt myself',
  'self-harm',
  'cut myself',
  'take all my pills',
  'overdose',
  'final goodbye',
  'my suicide note',
  'plan to kill',
  'no way out',
  'last resort',
  'end the pain',
  'worthless',
  'hopeless'
];

// Generate a response based on the input message
export function generateResponse(message: string, history: any[] = []): { content: string, emotion: string, isCrisis: boolean } {
  // Convert message to lowercase for better matching
  const normalizedMessage = message.toLowerCase();
  const doc = nlp(normalizedMessage);
  
  // Check for crisis indicators first
  const isCrisis = crisisPatterns.some(pattern => normalizedMessage.includes(pattern));
  
  // Match patterns for response
  let matchedPattern = patterns.find(pattern => {
    const regex = new RegExp(pattern.pattern, 'i');
    return regex.test(normalizedMessage);
  });
  
  // Fall back to default pattern if no match
  if (!matchedPattern) {
    matchedPattern = patterns[patterns.length - 1]; // Default pattern
  }
  
  // If crisis patterns were detected, override with crisis response
  if (isCrisis) {
    matchedPattern = patterns.find(p => p.pattern.includes('kill myself')) || matchedPattern;
  }
  
  // Randomly select a response from the matched pattern
  const responses = matchedPattern.responses;
  const randomIndex = Math.floor(Math.random() * responses.length);
  const response = responses[randomIndex];
  
  return {
    content: response,
    emotion: matchedPattern.emotion || 'supportive',
    isCrisis: isCrisis
  };
}

// Analyze emotion in a text message
export function analyzeEmotion(message: string): { emotion: string, intensity: number, label: string, color: string } {
  const normalizedMessage = message.toLowerCase();
  const doc = nlp(normalizedMessage);
  
  // Find matching emotion pattern
  let matchedEmotion = emotionPatterns.find(pattern => {
    const regex = new RegExp(pattern.pattern, 'i');
    return regex.test(normalizedMessage);
  });
  
  // Fall back to neutral if no match
  if (!matchedEmotion) {
    matchedEmotion = emotionPatterns.find(pattern => pattern.emotion === 'neutral')!;
  }
  
  // Dynamic intensity based on language intensity markers
  let intensity = matchedEmotion.intensity;
  const intensifiers = ['very', 'really', 'extremely', 'so', 'incredibly', 'absolutely', 'completely', 'totally'];
  
  // Increase intensity if intensifiers are present
  intensifiers.forEach(intensifier => {
    if (normalizedMessage.includes(intensifier)) {
      intensity = Math.min(5, intensity + 1);
    }
  });
  
  // Decrease intensity if mitigating words are present
  const mitigators = ['somewhat', 'kind of', 'a bit', 'slightly', 'a little', 'not very'];
  mitigators.forEach(mitigator => {
    if (normalizedMessage.includes(mitigator)) {
      intensity = Math.max(1, intensity - 1);
    }
  });
  
  return {
    emotion: matchedEmotion.emotion,
    intensity: intensity,
    label: matchedEmotion.label,
    color: matchedEmotion.color
  };
}

// Detect crisis indicators in a message
export function detectCrisis(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return crisisPatterns.some(pattern => normalizedMessage.includes(pattern));
}