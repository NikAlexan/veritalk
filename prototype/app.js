const INDICATORS = {
  authority: { label: 'Выдаёт себя за официальное лицо', confidence: 0.93 },
  urgency: { label: 'Срочность и угрозы', confidence: 0.88 },
  otp: { label: 'Просит одноразовый код', confidence: 0.96 },
  secrecy: { label: 'Требует сохранять тайну', confidence: 0.81 },
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
  'Загрузка записи',
  'Поиск речи (VAD)',
  'Распознавание речи (рус. / каз.)',
  'Оценка индикаторов',
  'Формирование объяснения',
];

const USE_CASES = [
  { id: 'UC-1', title: 'Согласие на анализ', screen: 'consent', role: 'user' },
  { id: 'UC-2', title: 'Анализ записи звонка', screen: 'upload', role: 'user' },
  { id: 'UC-3', title: 'Анализ звонка в реальном времени', screen: 'live', role: 'user' },
  { id: 'UC-4', title: 'Предупреждение о высоком риске', screen: 'live', role: 'user' },
  { id: 'UC-5', title: 'Просмотр отчёта о риске', screen: 'report', role: 'user' },
  { id: 'UC-6', title: 'Удаление отчётов и данных', screen: 'settings', role: 'user' },
  { id: 'UC-7', title: 'Отправка отчёта родственнику', screen: 'share', role: 'user' },
  { id: 'UC-8', title: 'Просмотр общего отчёта (родственник)', screen: 'sharedWithMe', role: 'family' },
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
  if (score >= 70) return 'Высокий риск';
  if (score >= 40) return 'Средний риск';
  return 'Низкий риск';
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function highlight(segment) {
  return segment.text.replace(segment.phrase, `<mark>${segment.phrase}</mark>`);
}

function modeLabel(report) {
  return report.mode === 'live' ? 'Живой анализ' : 'Запись звонка';
}

function createReport(mode, id) {
  return {
    id,
    mode,
    score: 91,
    date: '19 окт., 14:02',
    segments: TRANSCRIPT,
    sharedWith: mode === 'recording' ? ['Родственник'] : [],
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
      <button class="${onSettings ? '' : 'on'}" data-action="navigate" data-value="home">Главная</button>
      <button class="${onSettings ? 'on' : ''}" data-action="navigate" data-value="settings">Настройки</button>
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
        <button class="btn danger" data-action="confirmDelete">Удалить</button>
        <button class="btn secondary" data-action="cancelDelete">Отмена</button>
      </div>
    </div>`;
}

function consentRequiredScreen() {
  return `
    ${topBar('Нужно согласие', 'UC-1')}
    <div class="content">
      <h3>Анализ выключен</h3>
      <p>VeriTalk не может анализировать звонки без вашего согласия. Ничего не было отправлено.</p>
      <button class="btn" data-action="navigate" data-value="consent">Открыть согласие</button>
    </div>`;
}

function highRiskWarning(score) {
  return `
    <div class="alert">
      <b>UC-4 · Высокий риск · ${score}/100</b>
      <h2>Похоже на мошенничество</h2>
      <div class="alert-reason">
        Собеседник просит код из SMS. Настоящий банк никогда его не спрашивает.
      </div>
      <div class="alert-advice">
        Не называйте коды и не переводите деньги. Можно завершить звонок и
        перезвонить в банк по номеру на карте.
      </div>
      <button data-action="dismissWarning">Понятно</button>
    </div>`;
}

const screens = {
  consent: () => `
    ${topBar('Прежде чем начать', 'UC-1')}
    <div class="content">
      <p>
        VeriTalk анализирует <b>содержание</b> звонка на нашем сервере. Аудио
        удаляется сразу после окончания анализа. Сохраняется только отчёт,
        и только если вы это разрешите.
      </p>
      ${consentToggle('analysis', 'Разрешить анализ звонков (обязательно)')}
      ${consentToggle('storage', 'Сохранять отчёты в моём аккаунте')}
      <button class="btn" data-action="navigate" data-value="home" ${state.consent.analysis ? '' : 'disabled'}>
        Продолжить
      </button>
    </div>`,

  home: () => {
    const reportList = state.reports.length
      ? state.reports
          .map((report) => reportCard(report, `${modeLabel(report)} · рус. + каз. · ${report.date}`))
          .join('')
      : '<p class="muted">Отчётов пока нет.</p>';
    return `
      ${topBar('VeriTalk', 'Главная')}
      <div class="content">
        <button class="btn" data-action="navigate" data-value="upload">Проверить запись звонка</button>
        <button class="btn secondary" data-action="navigate" data-value="live">Живой анализ по громкой связи</button>
        <h4>Отчёты</h4>
        ${reportList}
      </div>
      ${bottomNav()}`;
  },

  upload: () => {
    if (!state.consent.analysis) return consentRequiredScreen();
    return `
      ${topBar('Выберите запись', 'UC-2', 'home')}
      <div class="content">
        <p class="muted">
          Запишите звонок в приложении «Телефон» и поделитесь файлом с VeriTalk.
        </p>
        <div class="card" data-action="pickRecording">
          Call_2026-10-19_14-02.m4a<br>
          <small>0:38 · русский / казахский</small>
        </div>
        <div class="card" data-action="pickRecording" data-value="fail">
          Call_2026-10-18_09-15.m4a<br>
          <small>0:06 · без речи (пример ошибки)</small>
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
      ${topBar('Анализ', 'UC-2')}
      <div class="content">
        ${steps}
        <p class="muted">Аудио удаляется, когда анализ завершён, прерван ошибкой или отменён.</p>
        <button class="btn secondary" data-action="cancelAnalysis">Отмена</button>
      </div>`;
  },

  analysisFailed: () => `
    ${topBar('Анализ не удался', 'UC-2', 'home')}
    <div class="content">
      <h3>Речь не обнаружена</h3>
      <p>
        В этой записи не удалось найти речь. Проверьте, что звонок записан
        со звуком, и попробуйте другой файл.
      </p>
      <div class="success">✔ Аудио удалено</div>
      <button class="btn" data-action="navigate" data-value="upload">Выбрать другую запись</button>
    </div>`,

  live: () => {
    if (!state.consent.analysis) return consentRequiredScreen();

    if (!state.live.listening) {
      return `
        ${topBar('Живой анализ', 'UC-3', 'home')}
        <div class="content">
          <p>
            Включите громкую связь и держите телефон рядом. VeriTalk слушает
            через микрофон и обновляет оценку риска по ходу разговора.
          </p>
          <p class="muted">Пока приложение слушает, на экране видно уведомление. Аудио не сохраняется.</p>
          <button class="btn" data-action="startLive">Начать анализ</button>
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
        .join('') || '<p class="muted">Ожидание речи…</p>';
    return `
      ${topBar('Идёт анализ…', 'UC-3')}
      <div class="content">
        ${riskGauge(score)}
        ${utterances}
        <p class="muted">Аудио не сохраняется. Буфер удаляется после остановки.</p>
        <button class="btn danger" data-action="stopLive">Остановить и сохранить отчёт</button>
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
      ? `<div class="success">✔ Аудио удалено · ${unsaved ? 'отчёт не сохранён' : 'сохранён только отчёт'}</div>`
      : '';

    let ownerControls = '';
    if (!readOnly && unsaved) {
      ownerControls = `
        <p class="muted">
          Этот отчёт показан один раз и не сохраняется. Включите «Сохранять
          отчёты» в настройках, чтобы хранить отчёты и делиться ими.
        </p>`;
    } else if (!readOnly) {
      ownerControls = `
        <button class="btn secondary" data-action="navigate" data-value="share">Поделиться с родственником</button>
        <button class="btn danger" data-action="askDelete" data-value="one">Удалить этот отчёт</button>`;
    }

    const deleteDialog =
      state.pendingDelete === 'one'
        ? confirmDialog(
            'Удалить этот отчёт?',
            'Отчёт, его индикаторы, доказательства и доступы будут удалены. Это нельзя отменить.',
          )
        : '';

    return `
      ${topBar(readOnly ? 'Общий отчёт' : 'Отчёт о риске', readOnly ? 'UC-8' : 'UC-5', readOnly ? 'sharedWithMe' : 'home')}
      <div class="content">
        ${audioDeletedNotice}
        ${riskGauge(report.score)}
        <p class="muted" style="text-align:center">
          ${modeLabel(report)} · рус. + каз. · ${report.date}${unsaved ? ' · не сохранён' : ''}
        </p>
        ${indicators}
        <p class="muted">Это только рекомендация. VeriTalk никогда не блокирует и не завершает звонки.</p>
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
            <button data-action="revokeShare" data-value="${index}">Отозвать</button>
          </div>`)
        .join('') || '<p class="muted">Пока ни у кого.</p>';
    return `
      ${topBar('Поделиться отчётом', 'UC-7', 'report')}
      <div class="content">
        <p>Родственник увидит оценку, индикаторы и доказательства. Аудио он не получает.</p>
        <input type="text" id="share-with" placeholder="Аккаунт родственника">
        <button class="btn" data-action="addShare">Поделиться</button>
        <h4>Доступ есть у</h4>
        ${sharedWith}
      </div>`;
  },

  settings: () => `
    ${topBar('Настройки', 'UC-1 · UC-6')}
    <div class="content">
      <h4>Согласие</h4>
      ${consentToggle('analysis', 'Анализ звонков')}
      ${consentToggle('storage', 'Сохранять отчёты')}
      <h4>Ваши данные</h4>
      <button class="btn danger" data-action="askDelete">Удалить все отчёты и личные данные</button>
    </div>
    ${bottomNav()}
    ${
      state.pendingDelete === 'all'
        ? confirmDialog(
            'Удалить всё?',
            'Отчёты, индикаторы, доказательства и доступы будут удалены. Это нельзя отменить.',
          )
        : ''
    }`,

  sharedWithMe: () => {
    const shared = state.reports.filter((report) => report.sharedWith.length);
    const list =
      shared
        .map((report) => reportCard(report, `От вашего родственника · ${report.date}`))
        .join('') ||
      '<p class="muted">С вами пока ничем не поделились. Возможно, владелец отозвал доступ.</p>';
    return `
      ${topBar('Общие отчёты', 'UC-8')}
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
    <h1>Прототип VeriTalk</h1>
    <p>
      Кликабельный макет ключевых сценариев из docs/07-architecture.md.
      Все данные условные. Начните с UC-1.
    </p>
    <div class="role">
      ${roleButton('user', 'Пользователь')}
      ${roleButton('family', 'Родственник')}
    </div>
    ${shortcuts}
    <button data-action="reset">Сбросить прототип</button>`;
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
    showToast('Анализ отменён · ✔ аудио удалено');
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
    const name = document.getElementById('share-with').value.trim() || 'Родственник';
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
      showToast('Отчёт удалён');
    } else {
      state.reports = [];
      state.unsavedReport = null;
      state.pendingDelete = null;
      showToast('Все отчёты и личные данные удалены');
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
