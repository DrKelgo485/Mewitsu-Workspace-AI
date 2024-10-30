# Mewitsu - AI Workspace/Study & Ad Blocker

Mewitsu is a Chrome extension that provides an AI-powered workspace assistant with ad blocking capabilities. It helps users stay focused, manage their schedule, and perform various file operations.

## Features

- AI Assistant: Get help with your tasks and questions
- Ad Blocker: Block ads and pop-ups for a distraction-free browsing experience
- Focus Mode: Block distracting websites to improve productivity
- Schedule Maker: Generate AI-powered schedules
- File Tools: Format PDFs, convert images, and more (some features require premium)

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

Click on the Mewitsu icon in your Chrome toolbar to open the extension popup. From there, you can access all the features of the extension.

### AI Assistant
Type your questions or requests in the text area and click "Help" to get assistance from the AI.

### Ad Blocker
The ad blocker is always active. You can add or remove websites from the block list in the Ad Block tab.

### Focus Mode
Enable Focus Mode to block distracting websites. You can customize the list of blocked sites.

### Schedule Maker
Click on "Generate AI Schedule" in the Schedule tab to create an AI-powered schedule.

### File Tools
Access various file tools like PDF formatting and image conversion. Some advanced features require a premium subscription.

## Development

To set up the development environment:

1. Install dependencies: `npm install`
2. Build the extension: `npm run build`
3. Load the extension in Chrome as described in the Installation section

To make changes:
1. Modify the source files in the `src` directory
2. Rebuild the extension using `npm run build`
3. Reload the extension in Chrome to see your changes

For development with hot-reloading:
1. Run `npm run dev`
2. Any changes you make to the source files will automatically trigger a rebuild

## Testing

Run the test suite with:
