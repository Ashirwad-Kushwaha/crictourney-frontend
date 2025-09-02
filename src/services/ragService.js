import knowledgeBaseData from '../data/knowledgeBase.json';

// RAG Service for CricTourney Website
class RAGService {
  constructor() {
    this.knowledgeBase = knowledgeBaseData.knowledgeBase;
  }

  // JSON-based keyword matching
  findMatchingDocs(query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ');
    
    return this.knowledgeBase.filter(doc => {
      // Check if any keyword matches
      const keywordMatch = doc.keywords.some(keyword => 
        queryWords.includes(keyword) || queryLower.includes(keyword)
      );
      
      // Check title match
      const titleMatch = doc.title.toLowerCase().includes(queryLower);
      
      return keywordMatch || titleMatch;
    });
  }

  // Generate answer using retrieved context
  generateAnswer(query, relevantDocs) {
    if (relevantDocs.length === 0) {
      return {
        answer: "I don't have specific information about that topic in my knowledge base. Could you try asking about CricTourney's features, architecture, authentication, team management, tournaments, payments, or technical details?",
        sources: []
      };
    }

    // Combine relevant content
    const context = relevantDocs.map(doc => doc.content).join(' ');
    const sources = relevantDocs.map(doc => doc.title);
    
    // Simple answer generation based on query type
    let answer = '';
    
    if (query.toLowerCase().includes('how to') || query.toLowerCase().includes('how do')) {
      answer = this.generateHowToAnswer(query, relevantDocs);
    } else if (query.toLowerCase().includes('what is') || query.toLowerCase().includes('what are')) {
      answer = this.generateWhatIsAnswer(query, relevantDocs);
    } else {
      answer = this.generateGeneralAnswer(query, relevantDocs);
    }
    
    return { answer, sources };
  }

  generateHowToAnswer(query, docs) {
    const doc = docs[0];
    if (query.toLowerCase().includes('register') || query.toLowerCase().includes('create team')) {
      return `To register a team in CricTourney: 1) Login as a captain or create an account, 2) Navigate to team registration, 3) Fill team details and add players, 4) Complete payment via Razorpay for entry fee, 5) Wait for team verification. ${doc.content}`;
    }
    if (query.toLowerCase().includes('tournament') || query.toLowerCase().includes('create')) {
      return `To create a tournament in CricTourney: 1) Login with ADMIN role, 2) Go to Admin Dashboard, 3) Fill the 'Create a New Tournament' form on the left sidebar with: Tournament Name, Team Limit, Entry Fee, Venue details (street, state, district, city, pincode), 4) Click 'Create Tournament' button, 5) Your tournament will be created and teams can register for it. You can then create schedules and manage the tournament from the dashboard.`;
    }
    return `Based on the available information: ${doc.content}`;
  }

  generateWhatIsAnswer(query, docs) {
    return docs[0].content;
  }

  generateGeneralAnswer(query, docs) {
    const primaryDoc = docs[0];
    let answer = primaryDoc.content;
    
    if (docs.length > 1) {
      answer += ` Additionally, ${docs[1].content}`;
    }
    
    return answer;
  }

  // Main JSON-based query method
  query(userQuery) {
    const matchingDocs = this.findMatchingDocs(userQuery);
    const result = this.generateAnswer(userQuery, matchingDocs);
    
    return {
      success: true,
      query: userQuery,
      answer: result.answer,
      sources: result.sources,
      matchedDocs: matchingDocs.length,
      suggestedQuestions: this.getSuggestedQuestions()
    };
  }

  // Get all available topics
  getAvailableTopics() {
    return this.knowledgeBase.map(doc => ({
      title: doc.title,
      category: doc.category,
      keywords: doc.keywords
    }));
  }

  // Get suggested questions
  getSuggestedQuestions() {
    return [
      "What is CricTourney?",
      "How to create a tournament?",
      "How to register a team?",
      "What are the user roles?",
      "How does payment work?",
      "What tournament formats are supported?",
      "How to schedule matches?",
      "What are the system requirements?"
    ];
  }
}

export default new RAGService();