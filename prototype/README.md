# VeriTalk Prototype

**Task:** VRT-9 UX / prototype
**Depends on:** VRT-8 ([docs/07-architecture.md](../docs/07-architecture.md))

A clickable mockup of the key user scenarios. It is a single self-contained file with no installation and no server: open [`index.html`](index.html) in any browser. All data (transcript, scores, indicators) is illustrative and is not produced by a model.

## How to use

1. Open `index.html`. The phone on the right is the app; the list on the left jumps to any use case.
2. For the full flow, start at **UC-1** (consent) and follow the buttons. Analysis is blocked until consent is given, as in the architecture.
3. Under the phone, a caption shows which API call the current screen corresponds to.
4. **Phone user / Family member** switches the role for UC-8. **Reset prototype** restores the initial state.

## Use case coverage

| Use case | Where in the prototype | API call (illustrative) |
| --- | --- | --- |
| UC-1 Manage consent | First screen, and Settings | `PUT /v1/consents` |
| UC-2 Analyse a recorded call | Home → Analyse a recorded call → pick a file → progress → report | `POST /v1/recordings`, `GET /v1/jobs/{id}` |
| UC-3 Analyse a live call | Home → Live call → Start listening | `WS /v1/live` |
| UC-4 Warn about high risk | Live screen: red warning appears when the score reaches the threshold (70 here) | pushed over the WebSocket (`warning: true`) |
| UC-5 View a risk report | Report screen: score, indicators, tap an indicator to see evidence | `GET /v1/reports/{id}` |
| UC-6 Delete reports and data | Settings → Delete all reports and personal data | `DELETE /v1/reports` |
| UC-7 Share a risk report | Report → Share with a family member (add and revoke) | `POST /v1/reports/{id}/shares` |
| UC-8 View a shared report | Switch role to Family member | `GET /v1/shared-reports` |

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
- **Advisory only.** The warning text tells the user what was detected; the app never blocks or ends calls (proposal, Exclusion 2).
- **Consent gate.** UC-2 and UC-3 are blocked without consent from UC-1, and an unconsented analysis returns `403`.
- **Privacy visible in the UI.** Audio deletion is stated on the processing screen and on the live screen; the report can be kept or discarded depending on the "Save reports" consent.
- **Code-switching.** The sample transcript mixes Russian and Kazakh in one sentence to show the target case.

## Not covered

- Authentication and sign-in screens (a precondition in the architecture, not a user goal).
- Real model output, real audio capture, and the final visual design. The Android client will use Jetpack Compose, and this mockup only fixes the flow and content.
