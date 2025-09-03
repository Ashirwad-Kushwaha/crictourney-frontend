import knowledgeBaseData from '../data/knowledgeBase.json';
import { tournamentApi, teamApi, schedulerApi } from './api';
import { getUser } from '../auth.jsx';

// RAG Service for CricTourney Website
class RAGService {
  constructor() {
    this.knowledgeBase = knowledgeBaseData.knowledgeBase;
  }

  // Backend API integration methods
  async fetchTournaments() {
    try {
      const user = getUser();
      if (!user) return [];
      const response = await tournamentApi.get('/tournament/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }
  }

  async fetchMyTeams() {
    try {
      const user = getUser();
      if (!user) return [];
      const response = await teamApi.get('/teams/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async fetchSchedule(tournamentId) {
    try {
      const response = await schedulerApi.get(`/schedule/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
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

    // Get sources from relevant documents
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
      return `To register a team in CricTourney: 1) Login as a captain or create an account, 2) Navigate to team registration, 3) Fill team details and add players, 4) Complete payment via Razorpay for entry fee, 5) Wait for team verification. ${doc.content}\n\nWould you like me to show you available tournaments to register for?`;
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

  // Enhanced query method with backend integration
  async query(userQuery) {
    const queryLower = userQuery.toLowerCase();
    
    // Check for interactive commands
    if (this.isInteractiveQuery(queryLower)) {
      return await this.handleInteractiveQuery(queryLower);
    }
    
    // Regular knowledge base query
    const matchingDocs = this.findMatchingDocs(userQuery);
    const result = this.generateAnswer(userQuery, matchingDocs);
    
    return {
      success: true,
      query: userQuery,
      answer: result.answer,
      sources: result.sources,
      matchedDocs: matchingDocs.length,
      suggestedQuestions: this.getSuggestedQuestions(),
      interactive: false
    };
  }

  // Check if query requires interactive response
  isInteractiveQuery(query) {
    const interactiveKeywords = [
      'register for tournament', 'join tournament', 'available tournaments',
      'show tournaments', 'list tournaments', 'my teams', 'show teams',
      'view schedule', 'match schedule', 'tournament schedule',
      'register team', 'create team', 'payment history', 'my payments'
    ];
    return interactiveKeywords.some(keyword => query.includes(keyword));
  }

  // Handle interactive queries with backend data
  async handleInteractiveQuery(query) {
    const user = getUser();
    if (!user) {
      return {
        success: true,
        query,
        answer: "Please log in to access tournament features.",
        interactive: false,
        action: { type: 'redirect', url: '/login' }
      };
    }

    if (query.includes('tournament') && (query.includes('register') || query.includes('join') || query.includes('available') || query.includes('show') || query.includes('list'))) {
      const tournaments = await this.fetchTournaments();
      return {
        success: true,
        query,
        answer: tournaments.length > 0 ? "Here are the available tournaments you can register for:" : "No tournaments are currently available.",
        interactive: true,
        data: tournaments,
        type: 'tournaments',
        action: { type: 'show_tournaments' }
      };
    }

    if (query.includes('my teams') || query.includes('show teams')) {
      const teams = await this.fetchMyTeams();
      return {
        success: true,
        query,
        answer: teams.length > 0 ? "Here are your registered teams:" : "You haven't registered any teams yet.",
        interactive: true,
        data: teams,
        type: 'teams',
        action: { type: 'show_teams' }
      };
    }

    if (query.includes('schedule')) {
      const tournaments = await this.fetchTournaments();
      return {
        success: true,
        query,
        answer: tournaments.length > 0 ? "Here are the tournaments. Click 'Schedule' to view match schedules:" : "No tournaments available to view schedules.",
        interactive: true,
        data: tournaments,
        type: 'tournaments',
        action: { type: 'show_tournaments_for_schedule' }
      };
    }

    if (query.includes('payment') || query.includes('history')) {
      return {
        success: true,
        query,
        answer: "You can view your payment history and transaction details.",
        interactive: true,
        type: 'payment_redirect',
        action: { type: 'redirect', url: '/payment-history' }
      };
    }

    if (query.includes('register team') || query.includes('create team')) {
      return {
        success: true,
        query,
        answer: "To register a new team, you'll need to select a tournament first. Here are available tournaments:",
        interactive: true,
        data: await this.fetchTournaments(),
        type: 'tournaments',
        action: { type: 'show_tournaments' }
      };
    }

    return {
      success: true,
      query,
      answer: "I can help you with tournaments, teams, and schedules. Try asking 'show available tournaments' or 'show my teams'.",
      interactive: false
    };
  }

  // Get all available topics
  /* istanbul ignore next */
  getAvailableTopics() {
    return this.knowledgeBase.map(doc => ({
      title: doc.title,
      category: doc.category,
      keywords: doc.keywords
    }));
  }

  // Get suggested questions
  /* istanbul ignore next */
  getSuggestedQuestions() {
    const user = getUser();
    const baseQuestions = [
      "What is CricTourney?",
      "How to register a team?",
      "Show available tournaments",
      "How does payment work?"
    ];
    
    if (user) {
      if (user.role === 'ADMIN') {
        return [
          ...baseQuestions,
          "How to create a tournament?",
          "How to schedule matches?",
          "What are admin features?"
        ];
      } else {
        return [
          ...baseQuestions,
          "Show my teams",
          "View tournament schedule",
          "How to join tournaments?"
        ];
      }
    }
    
    return baseQuestions;
  }
}

export default new RAGService();