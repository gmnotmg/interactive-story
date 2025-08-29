# Interactive Story

A fun, interactive story generator built with **JavaScript**, **React**, and **Tailwind CSS**, powered by **AI IBM Granite Model** on [Replicate](https://replicate.com/ibm-granite/granite-3.3-8b-instruct).  

You can create your own adventure by selecting themes, characters, and goals step by step, or generate a full random story instantly.

---

## Features

- Step-by-step interactive story creation
- Random story generation
- Audio effects and background music
- Copy generated story to clipboard
- Responsive design for desktop and mobile
- Built with React, Tailwind CSS, Framer Motion, and SweetAlert2
- AI-powered story generation using IBM Granite Model (via Replicate)

---

## Demo

Run locally: [http://localhost:5173](http://localhost:5173)

---

## Installation

1. Clone the repository:
git clone https://github.com/gmnotmg/interactive-story.git
cd interactive-story

2. Install dependencies:
npm install

3. Add a .env file in the root directory with your Replicate API token:
REPLICATE_API_TOKEN=your_replicate_api_token
PORT=5000

4. Run the project with 2 different terminals:
npm run dev
&
node server.js 



The app will be running at http://localhost:5173
