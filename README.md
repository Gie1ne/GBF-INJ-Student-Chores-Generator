# Student Chore Generator

A lightweight web app for generating and saving daily reports for cleaning, health declarations, study periods, manual tasks, assembly attendance, and violations.

## Features

- Daily cleaning assignment form
- Health declaration generator
- Study period tracking
- General manualia report
- General assembly attendance
- Violation reporting
- Copy output to clipboard
- Save entries locally in browser storage
- Installable as a PWA

## Project Files

- `index.html` – main app layout
- `styles.css` – styling
- `script.js` – app logic and report generation
- `manifest.json` – PWA manifest
- `sw.js` – service worker for install/offline support
- `img_src/` – app images and logo assets

## How to Use

1. Open `index.html` in a browser, or serve the folder with a local web server.
2. Choose a section from the sidebar menu.
3. Fill in the required fields.
4. Click the generate button to create the report text.
5. Use the Copy button to copy the generated content.

## Notes

- The app is designed for quick daily reporting tasks.
- Data is stored in the browser using local storage for convenience.
- The project can also be installed on supported devices as a Progressive Web App.

## Suggested Local Run

Using Python:

```bash
cd "/home/gieyan/Documents/Programs/STUD CHORE"
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## License

This project is for internal/personal use unless otherwise stated by the owner.
