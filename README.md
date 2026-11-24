# Web Development Tasks

Two small front-end projects built with plain HTML, CSS and JavaScript (no frameworks or build tools).

| Task | Folder | Description |
|------|--------|-------------|
| 1 | [`task-1-image-gallery`](./task-1-image-gallery) | Responsive image gallery with category filters and a lightbox |
| 2 | [`task-2-calculator`](./task-2-calculator) | Calculator with live result preview and keyboard support |

## Task 1: Image Gallery

- CSS Grid layout that adapts from phones to wide desktops
- Hover zoom, sliding captions and smooth transitions
- Lightbox with next/previous buttons, counter, keyboard arrows, `Esc` and swipe support
- Category filters (All, Nature, City, Abstract); the lightbox only cycles through the active category
- Images are generated as inline SVG. To use your own photos, edit the `ITEMS` array in `script.js` and set `src` to your image paths.

## Task 2: Calculator

- Operations: `+`, `−`, `×`, `÷` and `%`, with correct operator precedence
- Hand-written expression parser (no `eval`)
- Live result preview while typing, `AC` to clear, `⌫` to delete
- Handles division by zero, repeated operators and multiple decimal points
- Keyboard support: digits, `+ - * /`, `.`, `%`, `Enter`, `Backspace`, `Esc`

## Run locally

No installation needed. Open `index.html` inside either task folder in a browser, or serve the repo:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/task-1-image-gallery/ or /task-2-calculator/
```

## Project structure

```
web-dev-tasks/
├── README.md
├── .gitignore
├── task-1-image-gallery/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── task-2-calculator/
    ├── index.html
    ├── style.css
    └── script.js
```
