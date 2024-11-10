// Data for emojis
const emojiData = {
    smileys: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😇','🙂','🙃','😌','😍','😘','😗','😙','😚','😋','😜'],
    activities: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥅','🏒','🥊','🎳','🏹','🥋','🏆','🏅','🎽','🥌'],
    food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥒']
};

let selectedTimeslot = null;
let draggedEmoji = null;
let draggedEmojiClone = null;
let currentDroppable = null;

// Generate the timeslots in the timeline
function generateTimeslots() {
    const timeline = document.getElementById('timeline');
    for (let hour = 8; hour <= 23; hour++) {
        const hour12 = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const timeLabel = `${hour12}:00 ${amPm}`;

        const timeslotDiv = document.createElement('div');
        timeslotDiv.classList.add('timeslot');

        const timeslotHeader = document.createElement('div');
        timeslotHeader.classList.add('timeslot-header');
        timeslotHeader.textContent = timeLabel;

        const emojiPlaceholdersDiv = document.createElement('div');
        emojiPlaceholdersDiv.classList.add('emoji-placeholders');

        for (let i = 0; i < 4; i++) {
            const emojiPlaceholder = document.createElement('div');
            emojiPlaceholder.classList.add('emoji-placeholder');
            // Add event listener for dropping emojis
            emojiPlaceholder.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, false);
            emojiPlaceholdersDiv.appendChild(emojiPlaceholder);
        }

        const notePlaceholder = document.createElement('div');
        notePlaceholder.classList.add('note-placeholder');

        const noteInput = document.createElement('textarea');
        noteInput.classList.add('note-input');
        noteInput.setAttribute('placeholder', 'Add note...');

        notePlaceholder.appendChild(noteInput);

        timeslotDiv.appendChild(timeslotHeader);
        timeslotDiv.appendChild(emojiPlaceholdersDiv);
        timeslotDiv.appendChild(notePlaceholder);

        timeline.appendChild(timeslotDiv);
    }
}

// Open the emoji drawer
function openEmojiDrawer() {
    const drawer = document.getElementById('emoji-drawer');
    drawer.classList.add('open');
    loadEmojis('smileys');
}

// Close the emoji drawer
function closeEmojiDrawer() {
    const drawer = document.getElementById('emoji-drawer');
    drawer.classList.remove('open');
}

// Load emojis into the emoji grid
function loadEmojis(category) {
    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = '';
    const emojis = emojiData[category];
    emojis.forEach(emojiChar => {
        const emojiItem = document.createElement('div');
        emojiItem.classList.add('emoji-item');
        emojiItem.textContent = emojiChar;

        // Touch event listeners for drag-and-drop
        emojiItem.addEventListener('touchstart', handleDragStart, false);
        emojiItem.addEventListener('touchmove', handleDragMove, false);
        emojiItem.addEventListener('touchend', handleDragEnd, false);

        emojiGrid.appendChild(emojiItem);
    });
}

// Handle the drag start event
function handleDragStart(e) {
    e.preventDefault();
    draggedEmoji = e.target;
    draggedEmojiClone = draggedEmoji.cloneNode(true);
    draggedEmojiClone.classList.add('dragging-clone');
    document.body.appendChild(draggedEmojiClone);
    document.body.style.overflow = 'hidden';

    // Position the clone at the touch point
    const touch = e.touches[0];
    draggedEmojiClone.style.left = `${touch.clientX}px`;
    draggedEmojiClone.style.top = `${touch.clientY}px`;
}

// Handle the drag move event
function handleDragMove(e) {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    const touch = e.touches[0];
    draggedEmojiClone.style.left = `${touch.clientX}px`;
    draggedEmojiClone.style.top = `${touch.clientY}px`;

    // Get the element under the touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elementBelow) return;

    const droppableBelow = elementBelow.closest('.emoji-placeholder');

    if (currentDroppable !== droppableBelow) {
        if (currentDroppable) {
            currentDroppable.classList.remove('highlight');
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
            currentDroppable.classList.add('highlight');
        }
    }
}

// Handle the drag end event
function handleDragEnd(e) {
    if (!draggedEmojiClone) return;

    draggedEmojiClone.remove();
    draggedEmojiClone = null;
    document.body.style.overflow = 'auto';

    if (currentDroppable) {
        currentDroppable.textContent = draggedEmoji.textContent;
        currentDroppable.classList.remove('highlight');
    }

    draggedEmoji = null;
    currentDroppable = null;
}

// Initialize the app
function init() {
    generateTimeslots();
    document.getElementById('open-drawer-button').addEventListener('click', openEmojiDrawer);
    document.getElementById('close-drawer').addEventListener('click', closeEmojiDrawer);

    // Tab buttons for changing emoji categories
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            button.classList.add('active');
            // Load emojis for selected category
            const category = button.getAttribute('data-category');
            loadEmojis(category);
        });
    });
}

init();
