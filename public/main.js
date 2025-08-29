const storyEl = document.getElementById('story');
const choicesEl = document.getElementById('choices');

// Load initial story
async function loadStory() {
    const res = await fetch('/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: '' })
    });
    const data = await res.json();
    renderStory(data);
}

function renderStory(data) {
    storyEl.textContent = data.story_text;
    choicesEl.innerHTML = '';
    data.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.className = "w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600";
        btn.onclick = () => selectChoice(choice);
        choicesEl.appendChild(btn);
    });
}

async function selectChoice(choice) {
    const res = await fetch('/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice })
    });
    const data = await res.json();
    renderStory(data);
}

// Start
loadStory();