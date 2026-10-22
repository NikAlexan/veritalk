# VeriTalk Prototype

**Task:** VRT-9 UX / prototype
**Depends on:** VRT-8 ([docs/07-architecture.md](../docs/07-architecture.md))

A clickable mockup of the key user scenarios. There is no installation and no server: open [`index.html`](index.html) in any browser, keeping it in the same folder as [`style.css`](style.css) and [`app.js`](app.js). All data (transcript, scores, indicators) is illustrative and is not produced by a model.

| File | Contents |
| --- | --- |
| `index.html` | Page skeleton: sidebar, phone frame, API caption |
| `style.css` | Layout and components |
| `app.js` | Sample data, one function per screen, and the actions behind the buttons |

## How to use

1. Open `index.html`. The phone on the right is the app; the list on the left jumps to any use case.
2. For the full flow, start at **UC-1** (consent) and follow the buttons. Analysis is blocked until consent is given, as in the architecture.
3. Under the phone, a caption shows which API call the current screen corresponds to.
4. **Phone user / Family member** switches the role for UC-8. **Reset prototype** restores the initial state.

## Use case coverage

| Use case | Where in the prototype | API call (illustrative) |
| --- | --- | --- |
| UC-1 Manage consent | First screen, and Settings | `PUT /v1/consents` |
| UC-2 Analyse a recorded call | Home → Analyse a recorded call → pick a file → progress → report. The second file shows the failure path ("No speech detected"); **Cancel** stops the analysis | `POST /v1/recordings`, `GET /v1/jobs/{id}` |
| UC-3 Analyse a live call | Home → Live call → Start listening | `WS /v1/live` |
| UC-4 Warn about high risk | Live screen: a full-screen red warning with the reason appears once per call when the score reaches the threshold (70 here) | pushed over the WebSocket (`warning: true`) |
| UC-5 View a risk report | Report screen: score, indicators, tap an indicator to see its evidence with start and end time and the trigger phrase highlighted | `GET /v1/reports/{id}` |
| UC-6 Delete reports and data | Report → Delete this report, or Settings → Delete all reports and personal data | `DELETE /v1/reports/{id}`, `DELETE /v1/reports` |
| UC-7 Share a risk report | Report → Share with a family member (add and revoke). Only saved reports can be shared | `POST /v1/reports/{id}/shares` |
| UC-8 View a shared report | Switch role to Family member | `GET /v1/shared-reports`, `GET /v1/shared-reports/{id}` |

## Example API data

Endpoint paths are a proposal for discussion with the backend; the architecture document does not fix them yet. Field names follow the data model in Section VII of the architecture document. No audio and no full transcript is stored.

**Recording upload (UC-2)**

```http
POST /v1/recordings
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

file=@Call_2026-10-19_14-02.m4a
```

```json
{ "job_id": "j_4821", "status": "queued" }
```

**Risk report (UC-5)**

```json
{
  "id": 1,
  "mode": "recording",
  "languages": ["ru", "kk"],
  "risk_score": 91,
  "model_version": "prototype",
  "created_at": "2026-10-19T14:02:00Z",
  "indicators": [
    {
      "type": "request_one_time_code",
      "confidence": 0.96,
      "segments": [
        { "start_ms": 23000, "end_ms": 27000, "text": "Назовите код из SMS, который сейчас придёт." }
      ]
    },
    {
      "type": "authority_impersonation",
      "confidence": 0.93,
      "segments": [
        { "start_ms": 2000, "end_ms": 6000, "text": "Здравствуйте, это служба безопасности банка." }
      ]
    }
  ]
}
```

**Live analysis (UC-3, UC-4)**

Client to server: binary audio chunks over `WS /v1/live`. Server to client, after each completed utterance:

```json
{
  "type": "update",
  "score": 78,
  "warning": true,
  "indicators": [
    {
      "type": "request_one_time_code",
      "confidence": 0.96,
      "segments": [{ "start_ms": 23000, "end_ms": 27000, "text": "Назовите код из SMS, который сейчас придёт." }]
    }
  ]
}
```

When the user stops, the server sends `{ "type": "final", "report_id": 2 }` and deletes the buffered audio.

## Design decisions

- **Explainability first.** The report shows indicators with confidence, and each one expands to the transcript segments that support it (proposal O3).
- **Advisory only.** The warning covers the whole screen, states the reason in large text and suggests what to do (FR-8); the app never blocks or ends calls (proposal, Exclusion 2).
- **Consent gate.** UC-2 and UC-3 are blocked without consent from UC-1, and an unconsented analysis returns `403`.
- **Privacy visible in the UI.** "Audio deleted" is confirmed after every analysis: on the report after a recording or a live call, on the error screen after a failure, and in a message after a cancel (FR-14). Without the "Save reports" consent the report is shown once, cannot be shared and is not kept (FR-15).
- **Code-switching.** The sample transcript mixes Russian and Kazakh in one sentence to show the target case.

## Not covered

- Authentication and sign-in screens (a precondition in the architecture, not a user goal).
- Interface language. The screens are in English so that the committee can read them. The Android client is built in Russian (FR-22) and Kazakh (FR-23); the transcript examples are already in Russian and Kazakh.
- The final indicator taxonomy. The indicator names are placeholders until the corpus work defines the taxonomy ([06-requirements.md](../docs/06-requirements.md), Open Point 4).
- Real model output, real audio capture, and the final visual design. The Android client will use Jetpack Compose, and this mockup only fixes the flow and content.
