# Entity Salience Analysis Tool

## Project Overview
A web-based tool that analyzes text to extract entities and calculate their salience scores using Google Cloud Natural Language API. The tool identifies key entities (people, places, organizations, etc.) in Italian and other languages, providing importance scores and metadata.

## Repository Information
- **Repository**: https://github.com/armoniap/salience
- **Branch**: main
- **Hosting**: gitsite compatible (static hosting)
- **Live URL**: Will be available through gitsite deployment

## Tech Stack & Architecture
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **API**: Google Cloud Natural Language API
- **Hosting**: Static hosting compatible (no backend required)
- **Design**: Responsive, mobile-first approach
- **Styling**: Modern CSS with CSS Grid/Flexbox, CSS variables for theming

## API Configuration
- **Google Cloud Natural Language API Key**: ``
- **Endpoint**: `https://language.googleapis.com/v1/documents:analyzeEntities`
- **Method**: POST
- **Primary Feature**: Entity Analysis with Salience Scoring
- **Language Support**: Primarily Italian, auto-detection for other languages

## File Structure
```
/
├── index.html              # Main application entry point
├── styles/
│   ├── main.css           # Main stylesheet
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Media queries and responsive design
├── scripts/
│   ├── app.js            # Main application logic
│   ├── api.js            # Google API integration
│   ├── analyzer.js       # Text analysis and processing
│   └── ui.js             # UI interactions and DOM manipulation
├── assets/
│   ├── icons/            # SVG icons and graphics
│   └── images/           # Any images or logos
├── README.md             # Project documentation
└── CLAUDE.md            # This file
```

## Core Features to Implement
1. **Text Input Interface**: Large textarea for text input with character count
2. **Language Detection**: Auto-detect or manual language selection
3. **Entity Analysis**: Extract entities with salience scores
4. **Results Display**: 
   - Entity list with types (PERSON, LOCATION, ORGANIZATION, etc.)
   - Salience scores (0-1 scale) with visual indicators
   - Wikipedia links when available
   - Entity mentions with text highlighting
5. **Export Options**: JSON, CSV export of results
6. **Error Handling**: API errors, rate limiting, invalid input
7. **Loading States**: Progress indicators during API calls

## MCP Tools Integration

### When to Use MCP Context 7
- **Complex API integrations**: When working with Google Cloud Natural Language API responses
- **Data transformation**: Converting API responses to user-friendly formats
- **Error analysis**: Debugging API calls and response parsing
- **Performance optimization**: Analyzing API usage patterns and costs
- **Testing scenarios**: Generating test cases for different entity types and languages

### MCP Usage Guidelines
- Use `mcp context 7` for advanced API response analysis
- Leverage MCP tools when standard context isn't sufficient for complex debugging
- Apply MCP context when working with large JSON responses from Google API
- Utilize MCP for comprehensive error handling strategy development

## Development Guidelines

### Code Style
- Use ES6+ modern JavaScript features (const/let, arrow functions, async/await)
- Follow semantic HTML5 structure
- Use CSS custom properties (variables) for consistent theming
- Implement mobile-first responsive design
- Keep functions pure and modular where possible
- Use descriptive variable names and add comments for complex logic

### API Integration
- Use `fetch()` API for HTTP requests
- Implement proper error handling for API failures
- Add retry logic for rate limiting (429 errors)
- Cache API responses when appropriate to reduce costs
- Validate input before sending to API (max length, language support)

### Performance Optimization
- Minimize API calls (debounce input, validate before calling)
- Implement lazy loading for large result sets
- Use efficient DOM manipulation
- Compress and optimize assets

### Security Best Practices
- API key should be visible in code (acceptable for frontend-only static hosting)
- Validate and sanitize all user inputs
- Implement content security policy headers where possible
- Use HTTPS for all API communications

## Testing Instructions
- Test with various text lengths (short tweets to long articles)
- Verify entity detection accuracy with Italian texts
- Test error handling (invalid API key, network failures, rate limiting)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Performance testing with large texts

## API Response Structure
```javascript
{
  "entities": [
    {
      "name": "Milano",
      "type": "LOCATION",
      "metadata": {
        "wikipedia_url": "https://it.wikipedia.org/wiki/Milano"
      },
      "salience": 0.8945,
      "mentions": [
        {
          "text": {
            "content": "Milano",
            "beginOffset": 15
          },
          "type": "PROPER"
        }
      ]
    }
  ],
  "language": "it"
}
```

## Key Entity Types
- PERSON: People, including fictional characters
- LOCATION: Physical locations (cities, countries, landmarks)
- ORGANIZATION: Companies, agencies, institutions
- EVENT: Named hurricanes, battles, wars, sports events
- WORK_OF_ART: Titles of books, songs, movies
- CONSUMER_GOOD: Brand names of products
- OTHER: Unknown or unlisted entity types

## Deployment
- Ensure all files are ready for static hosting
- No build process required (vanilla HTML/CSS/JS)
- Verify CORS compatibility with Google API (should work from browser)
- Test deployment on gitsite before going live
- Monitor API usage to stay within free tier limits (5K units/month)

## Error Handling Scenarios
- API key invalid or expired
- Network connectivity issues
- Rate limiting (429 status code)
- Quota exceeded (403 status code)
- Invalid input text (empty, too long, unsupported characters)
- CORS issues (unlikely with Google API but worth handling)

## Usage Tracking
- Monitor API usage through Google Cloud Console
- Implement basic analytics (text length processed, entities found)
- Track error rates and types
- Monitor performance metrics

## Important Notes
- ALWAYS validate text input before API calls to avoid unnecessary costs
- Keep CLAUDE.md updated as features are added
- Test thoroughly before each commit to main branch
- Follow semantic versioning for releases
- Document any breaking changes in README.md

## Common Commands
- Open project locally: Open `index.html` in browser or use live server
- Check API quota: Visit Google Cloud Console > APIs & Services > Quotas
- Deploy: Push to main branch for gitsite auto-deployment