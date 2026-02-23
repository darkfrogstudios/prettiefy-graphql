# Prettiefy GraphQL 🎨

A local-only Chrome extension for formatting and prettifying GraphQL queries with syntax highlighting. Perfect for developers working with GraphQL APIs who need to quickly format and read complex queries.

## ✨ Features

- **🔒 100% Local Processing** - No data ever leaves your browser
- **📝 Dual Input Support** - Paste JSON payloads or raw GraphQL queries
- **🎨 Syntax Highlighting** - Beautiful color-coded GraphQL with keyword, variable, string, and field highlighting
- **📱 Smart UI** - Two-stage interface that maximizes space for input and output
- **📋 One-Click Copy** - Copy formatted GraphQL with visual feedback
- **⚡ Real-Time Formatting** - Instant formatting as you type
- **🧹 Smart Cleanup** - Removes unnecessary whitespace and empty lines

## 🚀 Installation

### Option 1: Download from GitHub Releases
1. **Go to [Releases](https://github.com/yourusername/prettiefy-graphql/releases)**
2. **Download** the latest `prettiefy-graphql-extension.zip`
3. **Extract the ZIP file** to a folder on your computer
4. **Open Chrome** and navigate to `chrome://extensions/`
5. **Enable "Developer mode"** in the top right corner
6. **Click "Load unpacked"** and select the extracted folder
7. **The extension icon** will appear in your Chrome toolbar

### Option 2: Build from Source
1. Clone this repository: `git clone https://github.com/yourusername/prettiefy-graphql.git`
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the `dist` folder as an unpacked extension in Chrome

### Option 3: Chrome Web Store _(Coming Soon)_
- Will be available in the Chrome Web Store for one-click installation

## 📖 Usage

### Basic Usage
1. **Click the extension icon** in your Chrome toolbar
2. **Paste your content** in the input field:
   - JSON payload: `{"query": "mutation {...}"}`
   - Raw GraphQL: `query GetUser { user { name } }`
3. **View formatted output** - The extension automatically switches to show your prettified GraphQL
4. **Copy the result** - Click "Copy" to copy the formatted GraphQL to your clipboard

### Example Transformations

**Input JSON Payload:**
```json
{"query":"mutation BulkMutation{\r\n bulkCreate(data:{\r\n items:[\r\n {id:\"123\", name: \"Sample\"}\r\n]\r\n }){\r\n    success\r\n}\r\n}"}
```
**Output JSON Payload:**
mutation BulkMutation {
  bulkCreate(data: {
    items: [
      {id: "123", name: "Sample"}
    ]
  }) {
    success
  }
}

## 🛠 Development
Prerequisites
Node.js 16+
npm or yarn
Setup

## 🔒 Privacy & Security
This extension is designed with privacy as a core principle:

✅ No data collection - Zero user data is collected or stored
✅ No external requests - All processing happens locally in your browser
✅ No analytics or tracking - No usage statistics or tracking pixels
✅ Minimal permissions - Only requests clipboardWrite permission for copy functionality
✅ Open source - Full source code available for review

## 🎨 UI Features
* Dark theme with purple and green gradients
* Responsive design that works in the extension popup
* Smooth animations for state transitions
* Clear visual feedback for all user actions
* Accessible design with proper ARIA labels and keyboard support

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Development Guidelines
* Keep it simple - This extension focuses on one thing and does it well
* Maintain privacy - No external requests or data collection
* Test thoroughly - Ensure changes work across different GraphQL query types
* Follow existing code style - Consistent formatting and naming

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues & Support
If you encounter any issues or have feature requests:

Check existing issues in the GitHub repository
Create a new issue with detailed information about the problem
Include steps to reproduce any bugs you find

## 🚀 Roadmap
* Chrome Web Store publication
* Support for GraphQL schema definitions
* Export to file functionality
* Firefox extension version

## 📊 Stats
* Bundle size: ~15KB minified
* Load time: <100ms
* Memory usage: <2MB
* Supported browsers: Chrome 114+, Edge 114+

Made with ❤️ by developers, for developers
Star this repo if you find it useful! ⭐