const INDICATORS = {
  authority: { label: 'Authority impersonation', confidence: 0.93 },
  urgency: { label: 'Urgency and threats', confidence: 0.88 },
  otp: { label: 'Request for a one-time code', confidence: 0.96 },
  secrecy: { label: 'Demand for secrecy', confidence: 0.81 },
};

const TRANSCRIPT = [
  {
    start: 2,
    end: 6,
    indicator: 'authority',
    phrase: 'служба безопасности банка',
    text: 'Здравствуйте, это служба безопасности банка.',
    scoreAfter: 20,
  },
  {
    start: 9,
    end: 13,
    indicator: 'urgency',
    phrase: 'подозрительная операция',
    text: 'Сіздің картаңыз бойынша подозрительная операция.',
    scoreAfter: 38,
  },
  {
    start: 15,
    end: 19,
    indicator: 'urgency',
    phrase: 'действуйте прямо сейчас',
    text: 'Чтобы отменить перевод, действуйте прямо сейчас.',
    scoreAfter: 55,
  },
  {
    start: 23,
    end: 27,
    indicator: 'otp',
    phrase: 'код из SMS',
    text: 'Назовите код из SMS, который сейчас придёт.',
    scoreAfter: 78,
  },
  {
    start: 31,
    end: 35,
    indicator: 'secrecy',
    phrase: 'Никому не говорите',
    text: 'Никому не говорите об этом разговоре.',
    scoreAfter: 91,
  },
];

const WARNING_THRESHOLD = 70;

const ANALYSIS_STEPS = [
  'Uploading recording',
  'Detecting speech (VAD)',
  'Transcribing (RU / KK)',
  'Scoring indicators',
  'Building explanation',
];

const USE_CASES = [
  { id: 'UC-1', title: 'Manage consent', screen: 'consent', role: 'user' },
  { id: 'UC-2', title: 'Analyse a recorded call', screen: 'upload', role: 'user' },
  { id: 'UC-3', title: 'Analyse a live call', screen: 'live', role: 'user' },
  { id: 'UC-4', title: 'Warn about high risk (live)', screen: 'live', role: 'user' },
  { id: 'UC-5', title: 'View a risk report', screen: 'report', role: 'user' },
  { id: 'UC-6', title: 'Delete reports and data', screen: 'settings', role: 'user' },
  { id: 'UC-7', title: 'Share a risk report', screen: 'share', role: 'user' },
  { id: 'UC-8', title: 'View a shared report (family)', screen: 'sharedWithMe', role: 'family' },
];

const API_CALLS = {
  consent: 'PUT /v1/consents {analysis, report_storage}',
  consentRequired: 'POST /v1/recordings -> 403 consent_required',
  home: 'GET /v1/reports',
  upload: 'POST /v1/recordings (multipart) -> 202 {job_id}',
  analysing: 'GET /v1/jobs/{job_id} -> report_id; audio deleted',
  analysisFailed: 'GET /v1/jobs/{job_id} -> failed: no_speech, audio_deleted: true',
  live: 'WS /v1/live: audio chunks -> {score, indicators, warning}',
  report: 'GET /v1/reports/{id} | DELETE /v1/reports/{id}',
  familyReport: 'GET /v1/shared-reports/{id} (read-only)',
  share: 'POST /v1/reports/{id}/shares | DELETE .../shares/{id}',
  settings: 'PUT /v1/consents | DELETE /v1/reports',
  sharedWithMe: 'GET /v1/shared-reports',
};

function riskColor(score) {
  if (score >= 70) return '#c62828';
  if (score >= 40) return '#ed6c02';
  return '#2e7d32';
}

function riskLevel(score) {
  if (score >= 70) return 'High risk';
  if (score >= 40) return 'Medium risk';
  return 'Low risk';
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function highlight(segment) {
  return segment.text.replace(segment.phrase, `<mark>${segment.phrase}</mark>`);
}

function modeLabel(report) {
  return report.mode === 'live' ? 'Live call' : 'Recorded call';
}

function createReport(mode, id) {
  return {
    id,
    mode,
    score: 91,
    date: 'Oct 19, 14:02',
    segments: TRANSCRIPT,
    sharedWith: mode === 'recording' ? ['Family member'] : [],
  };
}

let state;
let liveTimer;

function idleLiveSession() {
  return { listening: false, heard: 0, warningVisible: false, warned: false };
}

function resetState() {
  clearInterval(liveTimer);
  state = {
    screen: 'consent',
    role: 'user',
    consent: { analysis: false, storage: false },
    reports: [createReport('recording', 1)],
    currentReportId: 1,
    unsavedReport: null,
    expandedIndicators: {},
    live: idleLiveSession(),
    analysisStep: 0,
    runId: 0,
    toastMessage: '',
    pendingDelete: null,
    justAnalysed: false,
  };
}

function currentReport() {
  return (
    state.reports.find((report) => report.id === state.currentReportId) ||
    state.unsavedReport
  );
}

function topBar(title, useCase, backTo) {
  const backButton = backTo
    ? `<button data-action="navigate" data-value="${backTo}">←</button>`
    : '';
  return `
    <div class="top-bar">
      ${backButton}${title}
      <span class="uc-tag">${useCase}</span>
    </div>`;
}

function bottomNav() {
  const onSettings = state.screen === 'settings';
  return `
    <div class="bottom-nav">
      <button class="${onSettings ? '' : 'on'}" data-action="navigate" data-value="home">Home</button>
      <button class="${onSettings ? 'on' : ''}" data-action="navigate" data-value="settings">Settings</button>
    </div>`;
}

function consentToggle(key, label) {
  return `
    <label class="toggle-row">
      <span>${label}</span>
      <input type="checkbox" data-consent="${key}" ${state.consent[key] ? 'checked' : ''}>
    </label>`;
}

function riskGauge(score) {
  return `
    <div class="gauge" style="--c:${riskColor(score)}">
      <b>${score}</b><small>/100</small>
    </div>
    <div class="level" style="color:${riskColor(score)}">${riskLevel(score)}</div>`;
}

function reportCard(report, subtitle) {
  return `
    <div class="card" data-action="openReport" data-value="${report.id}">
      <span class="chip" style="background:${riskColor(report.score)}">${report.score}</span>
      ${riskLevel(report.score)}<br>
      <small>${subtitle}</small>
    </div>`;
}

function confirmDialog(title, text) {
  return `
    <div class="modal">
      <div>
        <b>${title}</b>
        <p>${text}</p>
        <button class="btn danger" data-action="confirmDelete">Delete</button>
        <button class="btn secondary" data-action="cancelDelete">Cancel</button>
      </div>
    </div>`;
}

function consentRequiredScreen() {
  return `
    ${topBar('Consent required', 'UC-1')}
    <div class="content">
      <h3>Analysis is off</h3>
      <p>VeriTalk cannot analyse calls until you give consent. Nothing was uploaded.</p>
      <button class="btn" data-action="navigate" data-value="consent">Open consent</button>
    </div>`;
}

function highRiskWarning(score) {
  return `
    <div class="alert">
      <b>UC-4 · High risk · ${score}/100</b>
      <h2>This looks like a scam</h2>
      <div class="alert-reason">
        The caller is asking for a code from an SMS. A real bank never asks for it.
      </div>
      <div class="alert-advice">
        Do not share codes or transfer money. You can end the call and phone the
        bank on the number on your card.
      </div>
      <button data-action="dismissWarning">I understand</button>
    </div>`;
}

const screens = {
  consent: () => `
    ${topBar('Before we start', 'UC-1')}
    <div class="content">
      <p>
        VeriTalk analyses the <b>content</b> of a call on our server. Audio is
        deleted as soon as the analysis ends. Only the report is kept, and only
        if you allow it.
      </p>
      ${consentToggle('analysis', 'Allow call analysis (required)')}
      ${consentToggle('storage', 'Save reports to my account')}
      <button class="btn" data-action="navigate" data-value="home" ${state.consent.analysis ? '' : 'disabled'}>
        Continue
      </button>
    </div>`,

  home: () => {
    const reportList = state.reports.length
      ? state.reports
          .map((report) => reportCard(report, `${modeLabel(report)} · RU + KK · ${report.date}`))
          .join('')
      : '<p class="muted">No reports yet.</p>';
    return `
      ${topBar('VeriTalk', 'Home')}
      <div class="content">
        <button class="btn" data-action="navigate" data-value="upload">Analyse a recorded call</button>
        <button class="btn secondary" data-action="navigate" data-value="live">Live call on speakerphone</button>
        <h4>Reports</h4>
        ${reportList}
      </div>
      ${bottomNav()}`;
  },

  upload: () => {
    if (!state.consent.analysis) return consentRequiredScreen();
    return `
      ${topBar('Choose a recording', 'UC-2', 'home')}
      <div class="content">
        <p class="muted">
          Shared from your phone app. Record calls in the dialer, then share the file to VeriTalk.
        </p>
        <div class="card" data-action="pickRecording">
          Call_2026-10-19_14-02.m4a<br>
          <small>0:38 · Russian / Kazakh</small>
        </div>
        <div class="card" data-action="pickRecording" data-value="fail">
          Call_2026-10-18_09-15.m4a<br>
          <small>0:06 · no speech (shows the failure path)</small>
        </div>
      </div>`;
  },

  analysing: () => {
    const steps = ANALYSIS_STEPS.map((step, i) => {
      if (i < state.analysisStep) return `<div class="step done">✔ ${step}</div>`;
      if (i === state.analysisStep) return `<div class="step current">… ${step}</div>`;
      return `<div class="step">○ ${step}</div>`;
    }).join('');
    return `
      ${topBar('Analysing', 'UC-2')}
      <div class="content">
        ${steps}
        <p class="muted">The audio is deleted when the analysis finishes, fails or is cancelled.</p>
        <button class="btn secondary" data-action="cancelAnalysis">Cancel</button>
      </div>`;
  },

  analysisFailed: () => `
    ${topBar('Analysis failed', 'UC-2', 'home')}
    <div class="content">
      <h3>No speech detected</h3>
      <p>
        We could not find speech in this recording. Check that the call was
        recorded with sound, then try another file.
      </p>
      <div class="success">✔ Audio deleted</div>
      <button class="btn" data-action="navigate" data-value="upload">Choose another recording</button>
    </div>`,

  live: () => {
    if (!state.consent.analysis) return consentRequiredScreen();

    if (!state.live.listening) {
      return `
        ${topBar('Live analysis', 'UC-3', 'home')}
        <div class="content">
          <p>
            Put the call on speakerphone and keep this phone close. VeriTalk
            listens through the microphone and updates the risk as the call goes on.
          </p>
          <p class="muted">A notification stays visible while the app is listening. Audio is not stored.</p>
          <button class="btn" data-action="startLive">Start listening</button>
        </div>`;
    }

    const heard = TRANSCRIPT.slice(0, state.live.heard);
    const score = heard.length ? heard[heard.length - 1].scoreAfter : 0;
    const utterances =
      heard
        .map((segment) => `
          <div class="utterance">
            <small>${formatTime(segment.start)}</small> ${highlight(segment)}
          </div>`)
        .join('') || '<p class="muted">Waiting for speech…</p>';
    return `
      ${topBar('Listening…', 'UC-3')}
      <div class="content">
        ${riskGauge(score)}
        ${utterances}
        <p class="muted">Audio is not stored. Buffered audio is deleted when you stop.</p>
        <button class="btn danger" data-action="stopLive">Stop and save report</button>
      </div>
      ${state.live.warningVisible ? highRiskWarning(score) : ''}`;
  },

  report: () => {
    const report = currentReport();
    const readOnly = state.role === 'family';
    const unsaved = report === state.unsavedReport;

    const segmentsByIndicator = {};
    report.segments.forEach((segment) => {
      (segmentsByIndicator[segment.indicator] ||= []).push(segment);
    });

    const indicators = Object.entries(segmentsByIndicator)
      .map(([key, segments]) => {
        const expanded = state.expandedIndicators[key];
        const evidence = expanded
          ? segments
              .map((segment) => `
                <div class="evidence">
                  <i>${formatTime(segment.start)}–${formatTime(segment.end)}</i>${highlight(segment)}
                </div>`)
              .join('')
          : '';
        return `
          <div class="indicator">
            <div class="indicator-head" data-action="toggleIndicator" data-value="${key}">
              <span>${INDICATORS[key].label}</span>
              <span>${Math.round(INDICATORS[key].confidence * 100)}% ${expanded ? '▴' : '▾'}</span>
            </div>
            ${evidence}
          </div>`;
      })
      .join('');

    const audioDeletedNotice = state.justAnalysed
      ? `<div class="success">✔ Audio deleted · ${unsaved ? 'report not saved' : 'only the report is kept'}</div>`
      : '';

    let ownerControls = '';
    if (!readOnly && unsaved) {
      ownerControls = `
        <p class="muted">
          This report is shown once and is not kept. Turn on “Save reports” in
          Settings to keep and share reports.
        </p>`;
    } else if (!readOnly) {
      ownerControls = `
        <button class="btn secondary" data-action="navigate" data-value="share">Share with a family member</button>
        <button class="btn danger" data-action="askDelete" data-value="one">Delete this report</button>`;
    }

    const deleteDialog =
      state.pendingDelete === 'one'
        ? confirmDialog(
            'Delete this report?',
            'The report, its indicators, evidence and shares are removed. This cannot be undone.',
          )
        : '';

    return `
      ${topBar(readOnly ? 'Shared report' : 'Risk report', readOnly ? 'UC-8' : 'UC-5', readOnly ? 'sharedWithMe' : 'home')}
      <div class="content">
        ${audioDeletedNotice}
        ${riskGauge(report.score)}
        <p class="muted" style="text-align:center">
          ${modeLabel(report)} · RU + KK · ${report.date}${unsaved ? ' · not saved' : ''}
        </p>
        ${indicators}
        <p class="muted">Advisory only. VeriTalk never blocks or ends calls.</p>
        ${ownerControls}
      </div>
      ${deleteDialog}`;
  },

  share: () => {
    const sharedWith =
      currentReport()
        .sharedWith.map((name, index) => `
          <div class="toggle-row">
            <span>${name}</span>
            <button data-action="revokeShare" data-value="${index}">Revoke</button>
          </div>`)
        .join('') || '<p class="muted">Nobody yet.</p>';
    return `
      ${topBar('Share report', 'UC-7', 'report')}
      <div class="content">
        <p>Family members see the score, indicators and evidence. They never get audio.</p>
        <input type="text" id="share-with" placeholder="Family member's account">
        <button class="btn" data-action="addShare">Share</button>
        <h4>Shared with</h4>
        ${sharedWith}
      </div>`;
  },

  settings: () => `
    ${topBar('Settings', 'UC-1 · UC-6')}
    <div class="content">
      <h4>Consent</h4>
      ${consentToggle('analysis', 'Call analysis')}
      ${consentToggle('storage', 'Save reports')}
      <h4>Your data</h4>
      <button class="btn danger" data-action="askDelete">Delete all reports and personal data</button>
    </div>
    ${bottomNav()}
    ${
      state.pendingDelete === 'all'
        ? confirmDialog(
            'Delete everything?',
            'Reports, indicators, evidence and shares are removed. This cannot be undone.',
          )
        : ''
    }`,

  sharedWithMe: () => {
    const shared = state.reports.filter((report) => report.sharedWith.length);
    const list =
      shared
        .map((report) => reportCard(report, `Shared by your relative · ${report.date}`))
        .join('') ||
      '<p class="muted">Nothing is shared with you. The owner may have revoked access.</p>';
    return `
      ${topBar('Shared with me', 'UC-8')}
      <div class="content">${list}</div>`;
  },
};

function sidebar() {
  const roleButton = (role, label) => `
    <button class="${state.role === role ? 'on' : ''}" data-action="switchRole" data-value="${role}">
      ${label}
    </button>`;
  const shortcuts = USE_CASES.map(
    (useCase) => `
      <button data-action="jumpTo" data-value="${useCase.id}">
        <b>${useCase.id}</b> ${useCase.title}
      </button>`,
  ).join('');
  return `
    <h1>VeriTalk prototype</h1>
    <p>
      Clickable mockup of the key use cases from docs/07-architecture.md.
      All data is illustrative. Start with UC-1.
    </p>
    <div class="role">
      ${roleButton('user', 'Phone user')}
      ${roleButton('family', 'Family member')}
    </div>
    ${shortcuts}
    <button data-action="reset">Reset prototype</button>`;
}

function currentApiCall() {
  const blockedByConsent =
    (state.screen === 'upload' || state.screen === 'live') && !state.consent.analysis;
  if (blockedByConsent) return API_CALLS.consentRequired;
  if (state.screen === 'report' && state.role === 'family') return API_CALLS.familyReport;
  return API_CALLS[state.screen] || '';
}

function render() {
  const toast = state.toastMessage ? `<div class="toast">${state.toastMessage}</div>` : '';
  document.getElementById('screen').innerHTML = screens[state.screen]() + toast;
  document.getElementById('api').textContent = currentApiCall();
  document.getElementById('sidebar').innerHTML = sidebar();
}

function showToast(message) {
  state.toastMessage = message;
  render();
  setTimeout(() => {
    state.toastMessage = '';
    render();
  }, 1800);
}

function navigate(screen) {
  clearInterval(liveTimer);
  state.runId++;
  state.screen = screen;
  state.justAnalysed = false;
  state.pendingDelete = null;
  render();
}

function finishAnalysis(mode) {
  const report = createReport(mode, Date.now());
  if (state.consent.storage) {
    state.reports.unshift(report);
    state.unsavedReport = null;
  } else {
    state.unsavedReport = report;
  }
  state.currentReportId = report.id;
  state.screen = 'report';
  state.expandedIndicators = {};
  state.justAnalysed = true;
  render();
}

const actions = {
  navigate: (screen) => navigate(screen),

  openReport: (id) => {
    state.currentReportId = Number(id);
    navigate('report');
  },

  toggleIndicator: (key) => {
    state.expandedIndicators[key] = !state.expandedIndicators[key];
    render();
  },

  pickRecording: (variant) => {
    state.screen = 'analysing';
    state.analysisStep = 0;
    const run = ++state.runId;
    render();
    const nextStep = () => {
      if (state.runId !== run) return;
      state.analysisStep++;
      if (variant === 'fail' && state.analysisStep === 2) return navigate('analysisFailed');
      if (state.analysisStep >= ANALYSIS_STEPS.length) return finishAnalysis('recording');
      render();
      setTimeout(nextStep, 700);
    };
    setTimeout(nextStep, 700);
  },

  cancelAnalysis: () => {
    navigate('home');
    showToast('Analysis cancelled · ✔ audio deleted');
  },

  startLive: () => {
    state.live = { ...idleLiveSession(), listening: true };
    const run = ++state.runId;
    render();
    clearInterval(liveTimer);
    liveTimer = setInterval(() => {
      if (state.runId !== run || state.live.heard >= TRANSCRIPT.length) {
        clearInterval(liveTimer);
        return;
      }
      state.live.heard++;
      const latest = TRANSCRIPT[state.live.heard - 1];
      if (latest.scoreAfter >= WARNING_THRESHOLD && !state.live.warned) {
        state.live.warned = true;
        state.live.warningVisible = true;
      }
      render();
    }, 1500);
  },

  dismissWarning: () => {
    state.live.warningVisible = false;
    render();
  },

  stopLive: () => {
    clearInterval(liveTimer);
    state.runId++;
    finishAnalysis('live');
  },

  addShare: () => {
    const name = document.getElementById('share-with').value.trim() || 'Family member';
    currentReport().sharedWith.push(name);
    render();
  },

  revokeShare: (index) => {
    currentReport().sharedWith.splice(Number(index), 1);
    render();
  },

  askDelete: (scope) => {
    state.pendingDelete = scope || 'all';
    render();
  },

  cancelDelete: () => {
    state.pendingDelete = null;
    render();
  },

  confirmDelete: () => {
    if (state.pendingDelete === 'one') {
      state.reports = state.reports.filter((report) => report.id !== state.currentReportId);
      navigate('home');
      showToast('Report deleted');
    } else {
      state.reports = [];
      state.unsavedReport = null;
      state.pendingDelete = null;
      showToast('All reports and personal data deleted');
    }
  },

  switchRole: (role) => {
    state.role = role;
    navigate(role === 'family' ? 'sharedWithMe' : 'home');
  },

  reset: () => {
    resetState();
    render();
  },

  jumpTo: (id) => {
    const useCase = USE_CASES.find((uc) => uc.id === id);
    state.live = idleLiveSession();
    if (!state.reports.length && (id === 'UC-5' || id === 'UC-7')) {
      state.reports = [createReport('recording', 1)];
    }
    if (state.reports.length) state.currentReportId = state.reports[0].id;
    state.role = useCase.role;
    navigate(useCase.screen);
  },
};

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (target) actions[target.dataset.action](target.dataset.value);
});

document.addEventListener('change', (event) => {
  const key = event.target.dataset.consent;
  if (key) {
    state.consent[key] = event.target.checked;
    render();
  }
});

resetState();
render();
