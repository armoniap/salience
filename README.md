# Entity Salience Analysis Tool

A web-based tool that analyzes text to extract entities and calculate their salience scores using Google Cloud Natural Language API. The tool identifies key entities (people, places, organizations, etc.) in Italian and other languages, providing importance scores and metadata.

## Features

- **Text Analysis**: Analyze text to extract entities with salience scores
- **Multi-language Support**: Auto-detection or manual selection of language
- **Entity Types**: Detect PERSON, LOCATION, ORGANIZATION, EVENT, WORK_OF_ART, CONSUMER_GOOD, and OTHER entities
- **Salience Scoring**: Calculate importance scores (0-1 scale) for each entity
- **Visual Highlighting**: Highlight entities in original text with color coding
- **Export Options**: Export results to JSON or CSV format
- **Responsive Design**: Mobile-first responsive design for all devices
- **Error Handling**: Comprehensive error handling for API failures and network issues

## Live Demo

The tool is hosted at: [Your GitSite URL will be here]

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **API**: Google Cloud Natural Language API
- **Hosting**: Static hosting (GitSite compatible)
- **Styling**: CSS Grid/Flexbox, CSS variables for theming

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- Internet connection for API calls

### Installation

1. Clone the repository:
```bash
git clone https://github.com/armoniap/salience.git
cd salience
```

2. Open `index.html` in your web browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### Usage

1. **Enter Text**: Paste or type text into the input area
2. **Select Language**: Choose language or use auto-detection
3. **Analyze**: Click "Analyze Text" to process the text
4. **View Results**: Review entities with salience scores and types
5. **Export**: Download results as JSON or CSV

## API Configuration

The tool uses Google Cloud Natural Language API with the following configuration:

- **API Key**: Configured in `scripts/api.js`
- **Endpoint**: `https://language.googleapis.com/v1/documents:analyzeEntities`
- **Features**: Entity Analysis with Salience Scoring
- **Rate Limits**: 5,000 units per month (free tier)

## File Structure

```
/
├── index.html              # Main application entry point
├── styles/
│   ├── main.css           # Main stylesheet with CSS variables
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Media queries and responsive design
├── scripts/
│   ├── app.js            # Main application logic
│   ├── api.js            # Google API integration
│   ├── analyzer.js       # Text analysis and processing
│   └── ui.js             # UI interactions and DOM manipulation
├── assets/
│   ├── icons/            # SVG icons and graphics
│   └── images/           # Images and logos
├── README.md             # This file
└── CLAUDE.md            # Project instructions
```

## Entity Types

The tool detects the following entity types:

- **PERSON**: People, including fictional characters
- **LOCATION**: Physical locations (cities, countries, landmarks)
- **ORGANIZATION**: Companies, agencies, institutions
- **EVENT**: Named hurricanes, battles, wars, sports events
- **WORK_OF_ART**: Titles of books, songs, movies
- **CONSUMER_GOOD**: Brand names of products
- **OTHER**: Unknown or unlisted entity types

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Development

### Code Style

- Use ES6+ modern JavaScript features
- Follow semantic HTML5 structure
- Use CSS custom properties for theming
- Implement mobile-first responsive design
- Keep functions pure and modular

### Testing

- Test with various text lengths and languages
- Verify error handling scenarios
- Cross-browser compatibility testing
- Mobile responsiveness testing

## Deployment

The application is designed for static hosting and can be deployed to:

- GitHub Pages
- GitSite
- Netlify
- Vercel
- Any static hosting service

No build process is required - just upload the files to your hosting provider.

## API Usage and Costs

The tool uses Google Cloud Natural Language API:

- **Free Tier**: 5,000 units per month
- **Cost**: $1.00 per 1,000 units after free tier
- **Usage**: Each analysis request counts as 1 unit

Monitor your usage through the Google Cloud Console to stay within limits.

## Error Handling

The tool handles various error scenarios:

- Invalid or empty input
- API key issues
- Network connectivity problems
- Rate limiting (429 errors)
- Quota exceeded (403 errors)
- Server errors (500 errors)

## Privacy and Security

- All processing is done client-side except for API calls
- No text data is stored on servers
- API key is visible in client-side code (acceptable for frontend-only apps)
- All API communications use HTTPS

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Follow the contribution guidelines

## Changelog

### v1.0.0
- Initial release
- Basic entity analysis functionality
- Responsive design implementation
- Export functionality
- Error handling and validation

---

Built with ❤️ using Google Cloud Natural Language API