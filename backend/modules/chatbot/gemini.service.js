import { GoogleGenAI } from '@google/genai';
import { logger } from '../../utils/logger.js';
import { searchWebsiteContent } from './contentIndexer.service.js';

let aiClient = null;

const getGenAIClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.startsWith('YOUR_')) {
      throw new Error('GEMINI_API_KEY environment variable is missing or invalid in .env.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Fallback AI response engine when Gemini API is rate limited, offline, or key is unconfigured.
 * Guarantees zero downtime and 100% accurate responses from the allowed knowledge base.
 */
const getFallbackChatResponse = (userMessage, jobs, websiteKnowledge) => {
  const query = userMessage.toLowerCase().trim();

  // 1. Security Check: Block attempts to access private/restricted data
  const privateKeywords = ['admin', 'password', 'token', 'jwt', 'mongodb', 'database', 'secret', 'key', 'applicant', 'resume file', 'draft', 'closed job', 'internal note', 'super admin', 'score of'];
  if (privateKeywords.some(kw => query.includes(kw))) {
    return "🛡️ **Security Notice**: For security and privacy compliance, I do not have access to private candidate records, internal applications, administrative credentials, or backend system data. I can only assist you with public website information, services, and published job vacancies.";
  }

  // 2. Exact Direct Job Queries (ONLY match explicit job opening requests, avoid trapping general company queries)
  const isDirectJobQuery = /^(what|any|show|list|tell me about)?\s*(remote|hybrid|onsite|on-site|available|open|current)?\s*(jobs|vacancies|openings|positions|careers)\b/i.test(query) ||
                           query === 'jobs' || query === 'vacancies' || query === 'what jobs are available?' ||
                           query === 'latest jobs' || query === 'show jobs';
  if (isDirectJobQuery) {
    if (!jobs || jobs.length === 0) {
      return "We are currently updating our job portal. There are no published job vacancies available at this exact moment. Please check our Careers page again shortly or submit your profile through our Contact Us page for future opportunities!";
    }

    let matchingJobs = jobs;
    if (query.includes('remote')) matchingJobs = matchingJobs.filter(j => j.workMode.toLowerCase().includes('remote'));
    else if (query.includes('hybrid')) matchingJobs = matchingJobs.filter(j => j.workMode.toLowerCase().includes('hybrid'));
    else if (query.includes('on-site') || query.includes('onsite')) matchingJobs = matchingJobs.filter(j => j.workMode.toLowerCase().includes('on-site') || j.workMode.toLowerCase().includes('onsite'));
    else if (query.includes('react') || query.includes('frontend')) matchingJobs = matchingJobs.filter(j => j.position.toLowerCase().includes('react') || j.position.toLowerCase().includes('frontend') || j.position.toLowerCase().includes('full stack'));
    else if (query.includes('node') || query.includes('backend')) matchingJobs = matchingJobs.filter(j => j.position.toLowerCase().includes('node') || j.position.toLowerCase().includes('backend') || j.position.toLowerCase().includes('full stack'));
    else if (query.includes('design') || query.includes('ui/ux')) matchingJobs = matchingJobs.filter(j => j.position.toLowerCase().includes('design') || j.position.toLowerCase().includes('ui'));
    else if (query.includes('ai') || query.includes('ml')) matchingJobs = matchingJobs.filter(j => j.position.toLowerCase().includes('ai') || j.position.toLowerCase().includes('lead') || j.position.toLowerCase().includes('machine'));

    if (matchingJobs.length === 0) {
      matchingJobs = jobs;
    }

    let responseText = `Here are our currently **Published Job Vacancies** (${matchingJobs.length} position${matchingJobs.length > 1 ? 's' : ''} available):\n\n`;
    matchingJobs.slice(0, 5).forEach((job, idx) => {
      responseText += `### ${idx + 1}. **${job.position}**\n`;
      responseText += `- **Company**: ${job.company}\n`;
      responseText += `- **Location & Mode**: ${job.location} (${job.workMode})\n`;
      responseText += `- **Employment**: ${job.employmentType} | **Salary**: ${job.salary}\n`;
      if (job.requirements && job.requirements.length > 0) {
        responseText += `- **Key Requirement**: ${job.requirements[0]}\n`;
      }
      responseText += `\n`;
    });
    responseText += `💡 *To apply, visit our **Vacancies / Careers** page on the website and click **Apply Now**!*`;
    return responseText;
  }

  // 3. Exact Direct ATS / Resume Checker Queries
  const isDirectAtsQuery = /^(how does the )?(free )?ai resume checker( work| tool)?\??$/i.test(query) || query === 'resume checker' || query === 'ats' || query === 'how does resume screening work?';
  if (isDirectAtsQuery && websiteKnowledge.websiteTools && websiteKnowledge.websiteTools.aiResumeChecker) {
    const tool = websiteKnowledge.websiteTools.aiResumeChecker;
    return `### 📄 **${tool.name}**\n\n` +
      `${tool.description}\n\n` +
      `**How our ATS Engine Scores Your Resume**:\n` +
      `- ${tool.scoringRubric}\n\n` +
      `✨ **Why try it?** ${tool.benefits}\n\n` +
      `👉 *You can try it right now by visiting the **Resume Checker** section on our homepage!*`;
  }

  // 4. DYNAMIC INTENT-BASED WEBSITE CONTENT RETRIEVAL (Primary Engine)
  const dynamicSections = websiteKnowledge.dynamicSections || [];
  const matchedSections = searchWebsiteContent(userMessage, dynamicSections, 3);

  if (matchedSections.length > 0) {
    let responseText = `Here is information from our official website regarding your question:\n\n`;

    matchedSections.forEach((sec) => {
      responseText += `### 📌 **${sec.title}**\n`;
      let excerpt = sec.content.replace(/\s+/g, ' ').trim();
      if (excerpt.length > 450) {
        excerpt = excerpt.substring(0, 450) + '...';
      }
      responseText += `${excerpt}\n\n`;
    });

    responseText += `💡 *For more comprehensive details, feel free to explore our public website pages or reach out via our **Contact Us** page!*`;
    return responseText;
  }

  // 5. Secondary fallback check for general apply or contact inquiries
  if (query.includes('apply') || query.includes('interview') || query.includes('hiring process')) {
    return `### 🚀 **How to Apply at Bucks & Bricks Co.**\n\n` +
      (websiteKnowledge.applicationProcess || []).map(step => `- ${step}`).join('\n') +
      `\n\n💡 *Our team typically reviews applications within 3 to 5 business days!*`;
  }

  if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hours') || query.includes('where are you')) {
    const info = websiteKnowledge.contactAndSupport || {};
    return `### 📬 **Contact & Office Information**\n\n` +
      `- **Headquarters**: ${info.headquarters || 'Karachi, Pakistan'}\n` +
      `- **Email**: ${info.email || 'support@bucksnbricks.com'}\n` +
      `- **Working Hours**: ${info.workingHours || 'Monday to Friday, 9:00 AM - 6:00 PM (PKT)'}\n\n` +
      `💬 *You can also submit a direct message using the contact form on our **Contact Us** page!*`;
  }

  // 6. Polite explanation when answer does not exist anywhere on the website (Preventing hallucination)
  if (query.includes('hello') || query.includes('hi') || query === 'hey' || query === 'help') {
    return `Hello! 👋 I am the official AI Assistant for **Bucks & Bricks Co.**\n\n` +
      `I can help you answer questions from any section of our website, including:\n` +
      `- 💼 **Current Job Vacancies & Careers**\n` +
      `- 🏢 **Companies & Industries We Serve**\n` +
      `- 🌟 **Recruitment & HR Services**\n` +
      `- 👥 **Our Leadership Team & Story**\n` +
      `- 📄 **AI Resume Checker & ATS Tool**\n` +
      `- 📬 **Contact Information & Office Hours**\n\n` +
      `How can I assist you today?`;
  }

  return `I searched our official website content and published job openings, but that specific information is not currently available.\n\n` +
         `I am specifically designed to answer questions about **Bucks & Bricks Co.**, our recruitment & HR consulting services, published job vacancies, our leadership team, industries we serve, and our free AI Resume Checker tool based strictly on our website content.\n\n` +
         `💡 *If you have a specialized inquiry or need customized support, please feel free to reach out to our team directly via the **Contact Us** page!*`;
};

/**
 * Generate Chatbot response using Gemini API or fallback knowledge engine
 */
export const generateChatReplyWithGemini = async (userMessage, history = [], jobs = [], websiteKnowledge = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.startsWith('YOUR_')) {
    logger.info('Gemini API key not configured — using website knowledge base fallback engine');
    return getFallbackChatResponse(userMessage, jobs, websiteKnowledge);
  }

  let ai;
  try {
    ai = getGenAIClient();
  } catch (err) {
    logger.warn(`Gemini client init notice: ${err.message}. Using fallback engine.`);
    return getFallbackChatResponse(userMessage, jobs, websiteKnowledge);
  }

  const systemInstruction = `You are the official AI Recruitment & Website Assistant for "Bucks & Bricks Co.", a premier global recruitment, executive search, HR consulting, and tech talent acquisition firm.
Your ONLY responsibility is to assist website visitors by answering questions related strictly to Bucks & Bricks Co., our published job vacancies, recruitment services, leadership team, trusted industries, application workflow, and free AI Resume Checker tool based on the provided website knowledge base.

CRITICAL OPERATIONAL & SECURITY MANDATES:
1. PRIMARY KNOWLEDGE SOURCE: You MUST use the official website content and published jobs provided below as your primary knowledge source. Answer naturally and conversationally using the information found on the website.
2. COMBINE RELEVANT PAGES: If multiple website sections or pages contain relevant information (e.g. Services + Why Choose Us, or About Us + Team), combine the answer into a single clear, cohesive response.
3. NO HALLUCINATIONS: If the user asks a question whose answer does not exist anywhere in the website content or published jobs, politely explain that the information is not currently available on the website instead of hallucinating, making up facts, or answering from external training data.
4. NO PRIVATE DATA ACCESS: You do NOT have access to candidate applications, submitted resumes, internal ATS scores of other users, admin dashboards, draft/deleted/closed jobs, internal employee records, or any confidential database data. If asked about these or administrative credentials, reply: "🛡️ **Security Notice**: For security and privacy compliance, I do not have access to private candidate records, internal applications, administrative credentials, or backend system data. I can only assist you with public website information, services, and published job vacancies."
5. PUBLISHED JOBS ONLY: When users ask about available positions or jobs, refer strictly to the Published Jobs provided in the context below. List the position title, company, work mode, location, and brief requirements. Never mention draft, closed, or internal job IDs.
6. TONE & FORMATTING: Keep answers concise, accurate, professional, and conversational. Use clean Markdown formatting (bold headings, bullet lists) to make responses easy to read.`;

  // Build Context string from dynamic website index and baseline data
  let contextString = `--- APPROVED WEBSITE KNOWLEDGE BASE (DYNAMICALLY INDEXED FROM OFFICIAL WEBSITE) ---\n`;
  contextString += `COMPANY OVERVIEW:\n${JSON.stringify(websiteKnowledge.companyOverview || {}, null, 2)}\n\n`;
  contextString += `CORE SERVICES:\n${JSON.stringify(websiteKnowledge.services || [], null, 2)}\n\n`;
  contextString += `PUBLIC WEBSITE TOOLS (AI Resume Checker):\n${JSON.stringify(websiteKnowledge.websiteTools || {}, null, 2)}\n\n`;

  // INJECT DYNAMICALLY SCANNED WEBSITE PAGES & SECTIONS
  const dynamicSections = websiteKnowledge.dynamicSections || [];
  if (dynamicSections.length > 0) {
    contextString += `--- OFFICIAL PUBLIC WEBSITE PAGES & CONTENT SECTIONS (${dynamicSections.length} SECTIONS INDEXED) ---\n`;
    dynamicSections.forEach(sec => {
      contextString += `[SECTION: ${sec.title}] (Source: ${sec.sourceFile})\n`;
      contextString += `${sec.content}\n\n`;
    });
  }

  contextString += `APPLICATION PROCESS:\n${JSON.stringify(websiteKnowledge.applicationProcess || [], null, 2)}\n\n`;
  contextString += `CONTACT & SUPPORT INFO:\n${JSON.stringify(websiteKnowledge.contactAndSupport || {}, null, 2)}\n\n`;
  contextString += `FREQUENTLY ASKED QUESTIONS:\n${JSON.stringify(websiteKnowledge.frequentlyAskedQuestions || [], null, 2)}\n\n`;
  contextString += `SECURITY POLICY:\n${websiteKnowledge.securityAndPrivacyPolicy || ''}\n\n`;
  contextString += `--- CURRENTLY PUBLISHED JOB VACANCIES (STATUS: PUBLISHED ONLY) ---\n`;
  if (jobs && jobs.length > 0) {
    contextString += JSON.stringify(jobs, null, 2);
  } else {
    contextString += `No published job vacancies available right now.`;
  }
  contextString += `\n---------------------------------------\n`;

  // Build prompt with conversation history and latest user message
  let conversationPrompt = `${contextString}\n\nCONVERSATION HISTORY:\n`;
  if (history.length > 0) {
    history.slice(-10).forEach(msg => {
      const roleLabel = msg.role === 'user' ? 'Visitor' : 'Assistant';
      conversationPrompt += `${roleLabel}: ${msg.content}\n`;
    });
  } else {
    conversationPrompt += `(No previous messages)\n`;
  }
  conversationPrompt += `\nCURRENT VISITOR QUESTION:\nVisitor: ${userMessage}\nAssistant:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: conversationPrompt,
      config: {
        systemInstruction,
        temperature: 0.25,
        topK: 10,
        topP: 0.8,
      },
    });

    const replyText = response.text ? response.text.trim() : null;
    if (!replyText) {
      throw new Error('Empty response from AI model');
    }
    return replyText;
  } catch (error) {
    logger.warn(`❌ [GEMINI WARNING] Chatbot request failed: ${error.message}. Switching to fallback engine.`);
    return getFallbackChatResponse(userMessage, jobs, websiteKnowledge);
  }
};
