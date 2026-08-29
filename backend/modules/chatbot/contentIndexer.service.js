import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

// In-memory cache for indexed website sections to ensure high performance
let contentCache = {
  timestamp: 0,
  sections: [],
  ttlMs: 60 * 1000 // Cache for 60 seconds before checking for updates
};

/**
 * Locate frontend source directories across local dev and container deployment environments
 */
const getSrcDirectories = () => {
  const possibleRoots = [
    path.resolve(process.cwd(), 'src/components'),
    path.resolve(process.cwd(), 'src'),
    path.resolve(process.cwd(), '../src/components'),
    path.resolve(process.cwd(), '../src')
  ];

  const validDirs = possibleRoots.filter(dir => {
    try {
      return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    } catch {
      return false;
    }
  });

  // Return unique directories, preferring src/components if found
  return Array.from(new Set(validDirs)).slice(0, 2);
};

/**
 * Recursively find all content-bearing files (.tsx, .ts, .md, .json)
 */
const getAllContentFiles = (dirPath, arrayOfFiles = []) => {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          // Ignore admin panel, node_modules, dist, test directories, and dot-directories
          if (!['admin', 'node_modules', 'dist', 'build', '.git'].includes(file) && !file.startsWith('.')) {
            getAllContentFiles(fullPath, arrayOfFiles);
          }
        } else {
          if (/\.(tsx|ts|md|json)$/.test(file)) {
            // Ignore UI framework shells, animations boilerplate, types, and test files
            if (
              !['Chatbot.tsx', 'AdminLayout.tsx', 'animations.tsx', 'types.ts', 'vite-env.d.ts', 'main.tsx', 'App.tsx'].includes(file) &&
              !file.endsWith('.d.ts') &&
              !file.endsWith('.test.ts') &&
              !file.endsWith('.test.tsx')
            ) {
              arrayOfFiles.push(fullPath);
            }
          }
        }
      } catch (err) {
        // Skip inaccessible files
      }
    });
  } catch (err) {
    logger.debug(`Could not read directory ${dirPath}: ${err.message}`);
  }

  return arrayOfFiles;
};

/**
 * Extract clean readable text and structured information from frontend source files
 */
const extractCleanTextFromFile = (filePath, content) => {
  const fileName = path.basename(filePath);
  const pageName = fileName.replace(/\.(tsx|ts|md|json)$/, '');

  // Convert CamelCase/PascalCase filename into readable title (e.g. TrustedCompanies -> Trusted Companies)
  const readableTitle = pageName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^ /, '')
    .trim()
    + (pageName.toLowerCase().includes('page') ? '' : ' Section');

  if (filePath.endsWith('.json') || filePath.endsWith('.md')) {
    const text = content.replace(/["'{}[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      id: pageName.toLowerCase(),
      title: readableTitle,
      sourceFile: filePath,
      content: text,
      lastModified: fs.statSync(filePath).mtimeMs
    };
  }

  let text = content;

  // 1. Remove TS/JS import and export signatures
  text = text.replace(/^import\s+.*?(?:;|\n)/gm, ' ');
  text = text.replace(/^export\s+(?:default\s+)?(?:interface|type)\s+.*?(?:\}|;)/gms, ' ');

  // 2. Extract meaningful phrases inside JSX/HTML tags
  const extractedPhrases = [];
  const tagContentRegex = /<(?:h[1-6]|p|span|li|strong|em|div|AnimatedHeading|AnimatedParagraph|button|a)[^>]*>(.*?)<\/(?:h[1-6]|p|span|li|strong|em|div|AnimatedHeading|AnimatedParagraph|button|a)>/gis;
  let match;
  while ((match = tagContentRegex.exec(content)) !== null) {
    const innerText = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (innerText && innerText.length > 3 && !innerText.includes('import ') && !innerText.includes('export ')) {
      extractedPhrases.push(innerText);
    }
  }

  // Extract string literal props (e.g., text="...", title="...", name: "...", role: "...", description: "...")
  const propValueRegex = /(?:text|title|name|role|q|a|label|description|tagline|heading|subheading|badge|quote|author|position|company|location)[:=]\s*["']([^"']{3,})["']/gis;
  while ((match = propValueRegex.exec(content)) !== null) {
    const propText = match[1].trim();
    if (
      propText &&
      !propText.startsWith('/') &&
      !propText.startsWith('http') &&
      !propText.includes('.png') &&
      !propText.includes('.jpg') &&
      !propText.includes('.jpeg')
    ) {
      extractedPhrases.push(propText);
    }
  }

  // Deduplicate extracted phrases
  const uniquePhrases = Array.from(new Set(extractedPhrases))
    .filter(p => p && p.length > 3 && !/^[0-9a-fA-F-]+$/.test(p))
    .slice(0, 40);

  // 3. General stripping of HTML/JSX tags and code syntax noise
  const generalText = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, ' ')
    .replace(/(?:className|style|src|alt|id|key|onClick|onChange|variants|initial|animate|transition|viewport|whileHover|whileInView)[:=][^\s>]+/g, ' ')
    .replace(/["'{}[\]()=><+*;:,?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Combine extracted key phrases with general text summary
  const combinedContent = (uniquePhrases.join('. ') + ' ' + generalText).replace(/\s+/g, ' ').trim();
  const truncatedContent = combinedContent.substring(0, 2500);

  return {
    id: pageName.toLowerCase(),
    title: readableTitle,
    sourceFile: filePath,
    content: truncatedContent,
    lastModified: fs.statSync(filePath).mtimeMs
  };
};

/**
 * Scan and index website content dynamically with in-memory caching
 */
export const getDynamicWebsiteKnowledge = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && contentCache.sections.length > 0 && (now - contentCache.timestamp) < contentCache.ttlMs) {
    return contentCache.sections;
  }

  try {
    const srcDirs = getSrcDirectories();
    if (srcDirs.length === 0) {
      logger.warn('Content Indexer: No frontend source directory found. Returning cached content.');
      return contentCache.sections;
    }

    let allFiles = [];
    srcDirs.forEach(dir => {
      getAllContentFiles(dir, allFiles);
    });

    // Remove duplicate file paths
    allFiles = Array.from(new Set(allFiles));

    const sections = [];
    allFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const section = extractCleanTextFromFile(file, content);
        if (section && section.content && section.content.length > 20) {
          sections.push(section);
        }
      } catch (err) {
        logger.debug(`Could not read/parse content file ${file}: ${err.message}`);
      }
    });

    logger.debug(`🌐 Dynamic Website Indexer: Successfully scanned and indexed ${sections.length} public website sections.`);
    contentCache = {
      timestamp: now,
      sections,
      ttlMs: 60 * 1000
    };

    return sections;
  } catch (error) {
    logger.error(`Error in dynamic website content indexing: ${error.message}`);
    return contentCache.sections || [];
  }
};

/**
 * Semantic intent-based search over indexed website sections
 */
export const searchWebsiteContent = (query, sections = [], maxResults = 5) => {
  if (!query || typeof query !== 'string' || !sections || sections.length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase().trim();

  const stopWords = new Set([
    'what', 'is', 'the', 'a', 'an', 'do', 'you', 'how', 'can', 'for', 'in', 'on', 'to', 'with', 'about',
    'me', 'tell', 'please', 'some', 'any', 'are', 'we', 'they', 'our', 'my', 'your', 'have', 'has', 'had',
    'will', 'would', 'could', 'should', 'here', 'there', 'where', 'when', 'why', 'who', 'whom', 'which',
    'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'and', 'or',
    'but', 'if', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'from', 'up', 'down', 'out', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'work', 'working', 'company', 'companies',
    'information', 'details', 'know', 'want', 'need', 'list', 'give', 'show', 'find', 'looking', 'available'
  ]);

  const rawTokens = cleanQuery.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  const queryTokens = Array.from(new Set(rawTokens.filter(t => !stopWords.has(t))));

  // Synonym & Intent Expansion Map
  const intentMap = {
    'job': ['job', 'vacancy', 'vacancies', 'career', 'careers', 'hiring', 'position', 'positions', 'opportunity', 'opportunities', 'remote', 'hybrid', 'onsite'],
    'vacancy': ['job', 'vacancy', 'vacancies', 'career', 'careers', 'hiring', 'position'],
    'resume': ['resume', 'cv', 'ats', 'checker', 'scorer', 'score', 'upload', 'evaluate', 'match'],
    'ats': ['resume', 'cv', 'ats', 'checker', 'scorer', 'score'],
    'service': ['service', 'services', 'consulting', 'headhunting', 'search', 'staffing', 'augmentation', 'solution', 'solutions', 'offer', 'offering'],
    'client': ['client', 'clients', 'partner', 'partners', 'company', 'companies', 'industry', 'industries', 'sector', 'sectors', 'trusted', 'trust', 'work'],
    'company': ['company', 'companies', 'client', 'clients', 'partner', 'partners', 'industry', 'industries', 'sector', 'sectors', 'trusted', 'trust', 'work'],
    'industry': ['industry', 'industries', 'sector', 'sectors', 'fmcg', 'pharma', 'banking', 'manufacturing', 'textile', 'engineering', 'technology', 'hospitality'],
    'about': ['about', 'overview', 'who', 'history', 'mission', 'vision', 'goal', 'story', 'background', 'bucks', 'bricks'],
    'team': ['team', 'people', 'leadership', 'leader', 'director', 'partner', 'specialist', 'mark', 'nadia', 'evan', 'stefy', 'staff', 'employee'],
    'ceo': ['ceo', 'founder', 'executive', 'leader', 'vision', 'message', 'chief'],
    'contact': ['contact', 'email', 'phone', 'address', 'location', 'where', 'headquarters', 'office', 'hours', 'support', 'reach'],
    'why': ['why', 'choose', 'advantage', 'differentiator', 'benefit', 'benefits', 'unique', 'difference'],
    'blog': ['blog', 'article', 'articles', 'news', 'insight', 'insights', 'post', 'posts'],
    'impact': ['impact', 'result', 'results', 'stat', 'stats', 'number', 'numbers', 'track', 'record', 'success', 'testimonial', 'testimonials']
  };

  const expandedTokens = new Set(queryTokens);
  queryTokens.forEach(token => {
    Object.entries(intentMap).forEach(([key, synonyms]) => {
      if (token === key || synonyms.includes(token)) {
        synonyms.forEach(syn => expandedTokens.add(syn));
      }
    });
  });

  const scoredSections = sections.map(section => {
    let score = 0;
    const titleLower = section.title.toLowerCase();
    const contentLower = section.content.toLowerCase();
    const idLower = section.id.toLowerCase();

    // Exact phrase match bonus
    if (cleanQuery.length > 4 && titleLower.includes(cleanQuery)) score += 25;
    if (cleanQuery.length > 4 && contentLower.includes(cleanQuery)) score += 15;

    // Direct token match
    queryTokens.forEach(token => {
      if (titleLower.includes(token)) score += 12;
      if (idLower.includes(token)) score += 10;

      const regex = new RegExp(`\\b${token}\\b`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 3, 15);
      } else if (contentLower.includes(token)) {
        score += 3;
      }
    });

    // Expanded synonym match
    expandedTokens.forEach(token => {
      if (!queryTokens.includes(token)) {
        if (titleLower.includes(token)) score += 5;
        if (contentLower.includes(token)) score += 2;
      }
    });

    return {
      ...section,
      score
    };
  });

  return scoredSections
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};
