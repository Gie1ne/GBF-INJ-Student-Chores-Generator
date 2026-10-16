// Set today's date as default
document.getElementById('cleaningDate').valueAsDate = new Date();
document.getElementById('studyDate').valueAsDate = new Date();
document.getElementById('manualiaDate').valueAsDate = new Date();
document.getElementById('assemblyDate').valueAsDate = new Date();
document.getElementById('violationDate').valueAsDate = new Date();

// PWA Install
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

if (installBtn) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.add('show');
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBtn.classList.remove('show');
        }
    });
}

// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebarMenu');
const overlay = document.getElementById('overlay');
const menuItems = document.querySelectorAll('.menu-item');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        showSection(sectionId);
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const dailyCleaningGuide = {
    Monday: { DDC: 'Area A', PPC: 'Area B', MEC: 'Area C', SHC: 'Area D', FCC: 'Area E' },
    Tuesday: { DDC: 'Area B', PPC: 'Area C', MEC: 'Area D', SHC: 'Area E', FCC: 'Area A' },
    Wednesday: { DDC: 'Area C', PPC: 'Area D', MEC: 'Area E', SHC: 'Area A', FCC: 'Area B' },
    Thursday: { DDC: 'Area D', PPC: 'Area E', MEC: 'Area A', SHC: 'Area B', FCC: 'Area C' },
    Friday: { DDC: 'Area E', PPC: 'Area A', MEC: 'Area B', SHC: 'Area C', FCC: 'Area D' }
};

function getTodayCleaningGuide() {
    const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    const guide = dailyCleaningGuide[todayName];

    if (!guide) {
        return `<strong>Weekend notice:</strong><br>No daily cleaning assignment is scheduled for the weekend.`;
    }

    const entries = Object.entries(guide)
        .map(([committee, area]) => `- ${committee}: ${area}`)
        .join('<br>');

    return `<strong>${todayName}'s Cleaning Guide</strong><br>${entries}`;
}

const cleaningAreaHelpBtn = document.getElementById('cleaningAreaHelpBtn');
const cleaningAreaHelpPanel = document.getElementById('cleaningAreaHelpPanel');

if (cleaningAreaHelpBtn && cleaningAreaHelpPanel) {
    cleaningAreaHelpBtn.addEventListener('click', () => {
        const isHidden = cleaningAreaHelpPanel.hidden;
        cleaningAreaHelpPanel.innerHTML = getTodayCleaningGuide();
        cleaningAreaHelpPanel.hidden = !isHidden;
    });
}

// Cleaning Form
document.getElementById('cleaningForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = formatDate(document.getElementById('cleaningDate').value);
    const timeStarted = document.getElementById('timeStarted').value;
    const timeEnded = document.getElementById('timeEnded').value;
    const area = document.getElementById('cleaningArea').value;
    const hasSatClass = document.getElementById('hasSatClass').checked;
    const checkedBy = document.getElementById('checkedByName').value;

    const dateObj = new Date(date);
    const currentDay = dateObj.getDay();
    const totalDays = hasSatClass ? 6 : 5;
    const dayCount = `${currentDay} of ${totalDays}`;

    const output = `📝Re: Daily Cleaning
Date: ${date}
Time Started: ${timeStarted}
Time Ended: ${timeEnded}
Cleaning Assignment: ${area}
Remarks: Task Done (Day ${dayCount})
Checked by: ✅ ${checkedBy}`;

    document.getElementById('cleaningOutputContent').textContent = output;
    document.getElementById('cleaningOutput').style.display = 'block';
    showSuccess('successMessage');
    saveData('cleaning', { date, timeStarted, timeEnded, area, hasSatClass, checkedBy });
});

// Health Form
document.getElementById('healthForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const batch = document.getElementById('batch').value;
    const mcode = document.getElementById('mcode').value;
    const fullName = document.getElementById('healthFullName').value;
    const temp = document.getElementById('temperature').value || '(none)';

    const output = `${batch} - ${mcode} ${fullName} ${temp}`;

    document.getElementById('healthOutputContent').textContent = output;
    document.getElementById('healthOutput').style.display = 'block';
    showSuccess('successMessageHealth');
    saveData('health', { batch, mcode, fullName, temp });
});

// Study Form
document.getElementById('studyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = formatDate(document.getElementById('studyDate').value);
    const timeStart = document.getElementById('studyTimeStart').value;
    const timeEnd = document.getElementById('studyTimeEnd').value;
    const remarks = document.getElementById('studyRemarks').value;
    const checkedBy = document.getElementById('studyCheckedBy').value;

    const output = `📝Re: Study Period
Date: ${date}
Time Started: ${timeStart}
Time Ended: ${timeEnd}
Remarks: ${remarks}
Checked by: ✅ ${checkedBy}`;

    document.getElementById('studyOutputContent').textContent = output;
    document.getElementById('studyOutput').style.display = 'block';
    showSuccess('successMessageStudy');
    saveData('study', { date, timeStart, timeEnd, remarks, checkedBy });
});

// Manualia Form
document.getElementById('manualiaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = formatDate(document.getElementById('manualiaDate').value);
    const timeStart = document.getElementById('manualiaTimeStart').value;
    const timeEnd = document.getElementById('manualiaTimeEnd').value;
    const remarks = document.getElementById('manualiaRemarks').value;
    const checkedBy = document.getElementById('manualiaCheckedBy').value;

    const output = `📝General Manualia
Date: ${date}
Time Started: ${timeStart}
Time Ended: ${timeEnd}
Remark: ${remarks}
Checked by: ✅ ${checkedBy} (MEC Head)`;

    document.getElementById('manualiaOutputContent').textContent = output;
    document.getElementById('manualiaOutput').style.display = 'block';
    showSuccess('successMessageManualia');
    saveData('manualia', { date, timeStart, timeEnd, remarks, checkedBy });
});

// Assembly Form
document.getElementById('assemblyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = formatDate(document.getElementById('assemblyDate').value);
    const timeStart = document.getElementById('assemblyTimeStart').value;
    const timeEnd = document.getElementById('assemblyTimeEnd').value;
    const remarks = document.getElementById('assemblyRemarks').value;
    const checkedBy = document.getElementById('assemblyCheckedBy').value;

    const output = `📝Re: General Assembly
Date: ${date}
Time Started: ${timeStart}
Time Ended: ${timeEnd}
Remark: ${remarks}
Checked by: ✅ ${checkedBy} (Batch Senior Servant Leader)`;

    document.getElementById('assemblyOutputContent').textContent = output;
    document.getElementById('assemblyOutput').style.display = 'block';
    showSuccess('successMessageAssembly');
    saveData('assembly', { date, timeStart, timeEnd, remarks, checkedBy });
});

// Violation Form
document.getElementById('violationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('violationType').value;
    const date = formatDate(document.getElementById('violationDate').value);
    const name = document.getElementById('violationName').value;
    const remarks = document.getElementById('violationRemarks').value;
    const actionTaken = document.getElementById('violationAction').value;

    const output = `${type} Violation

Date: ${date}

Name: ${name}

Remarks: ${remarks}

Action Taken: ${actionTaken}`;

    document.getElementById('violationOutputContent').textContent = output;
    document.getElementById('violationOutput').style.display = 'block';
    showSuccess('successMessageViolation');
    saveData('violation', { type, date, name, remarks, actionTaken });
});

function showSuccess(elementId) {
    const msg = document.getElementById(elementId);
    msg.classList.add('show');
    setTimeout(() => {
        msg.classList.remove('show');
    }, 3000);
}

function copyToClipboard(elementId) {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) return;

    const clone = originalElement.cloneNode(true);

    const buttonsInClone = clone.querySelectorAll('button');
    buttonsInClone.forEach(button => button.remove());

    const text = clone.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        alert('Report copied successfully !');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function saveData(key, data) {
    localStorage.setItem(`chores_${key}`, JSON.stringify(data));
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}
