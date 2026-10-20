# Architecture Description

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-8 Architecture and diagrams
**Date:** Oct. 20, 2026
**Status:** Draft for pre-defense 1. The component view is a draft and will be refined during implementation.

## I. Overview

VeriTalk is a client–server system. A native Android application captures or imports call audio and presents results; an analysis server transcribes the audio, detects fraud indicators, computes a risk score and builds an explanation. Machine learning models are trained offline and deployed to the server as versioned artifacts. The technology choices behind this structure are justified in [05-technology-comparison.md](05-technology-comparison.md).

Three architectural principles follow from the proposal:

1. **Content-based and explainable.** Every result contains a risk score (0–100), the detected indicators, and the transcript segments that support each indicator (proposal O3).
2. **Privacy by design.** Audio exists only in temporary storage for the duration of an analysis job and is then deleted; only the report is stored, subject to user consent (proposal, Scope).
3. **Two analysis modes on one pipeline.** Uploaded recordings and live speakerphone audio pass through the same VAD → ASR → risk scoring → explanation pipeline; only the transport differs (proposal O4).

## II. Diagrams

All diagrams are written in PlantUML. The `.puml` files are the editable sources; `.svg` and `.png` are exports.

| # | Diagram | Source | Export |
| --- | --- | --- | --- |
| 1 | System context | [01-system-context.puml](../diagrams/01-system-context.puml) | [SVG](../diagrams/01-system-context.svg), [PNG](../diagrams/01-system-context.png) |
| 2 | Use case | [02-use-case.puml](../diagrams/02-use-case.puml) | [SVG](../diagrams/02-use-case.svg), [PNG](../diagrams/02-use-case.png) |
| 3 | Component (draft) | [03-component.puml](../diagrams/03-component.puml) | [SVG](../diagrams/03-component.svg), [PNG](../diagrams/03-component.png) |

To regenerate the exports: `java -jar plantuml.jar -tsvg -tpng diagrams/*.puml` (PlantUML 1.2024 or newer; the C4 library is bundled).

![System context](../diagrams/01-system-context.png)

## III. System Context

**Actors.** The *phone user* is the primary user: they upload recordings, run live analysis, read reports and manage consent. The *family member* views reports that a user shares with them (proposal, Target Users). The *caller* is the other party of the call; their speech is analysed, but they never interact with the system.

**External systems.** The *device dialer* produces call recordings, which reach VeriTalk through Android sharing or the file picker; VeriTalk itself does not capture audio from the telephony stack (proposal, Exclusion 1). *Android OS* provides microphone access for speakerphone capture, foreground services and notifications.

There are no integrations with banks, mobile operators or caller-ID services (proposal, Exclusions 4–5).

## IV. Use Cases

![Use case diagram](../diagrams/02-use-case.png)

| ID | Use case | Actor | Proposal objective |
| --- | --- | --- | --- |
| UC-1 | Register and sign in | User, family member | O5 |
| UC-2 | Give or withdraw consent to call analysis | User | Scope (privacy) |
| UC-3 | Analyse an uploaded call recording | User, device dialer | O4, O5 |
| UC-4 | Analyse a live call on speakerphone | User | O4, O5 |
| UC-5 | View risk report (score, indicators, evidence) | User, family member | O3, O5 |
| UC-6 | Receive live risk warning | User | O4 |
| UC-7 | Browse history of analysed calls | User | O5 |
| UC-8 | Delete a report or all personal data | User | Scope (privacy) |
| UC-9 | Share a report with a family member | User | Target Users |
| UC-10 | View a shared report | Family member | Target Users |

UC-3 and UC-4 include UC-2: analysis cannot start without recorded consent. The functional requirements in VRT-7 will be derived from these use cases and mapped to them.

## V. Components

![Component diagram](../diagrams/03-component.png)

### A. Android app (Kotlin 2.4, Jetpack Compose)

| Component | Responsibility | Use cases |
| --- | --- | --- |
| UI screens | Upload, live analysis, report, history, consent and sharing screens | UC-1–UC-10 |
| Live capture service | Foreground service; captures 16 kHz mono PCM from the microphone while a speakerphone call is in progress | UC-4, UC-6 |
| Recording importer | Receives recordings from the dialer via share intent or file picker | UC-3 |
| API client | HTTPS for uploads and reports; WebSocket for streaming | all |

### B. Analysis server (Python 3.14, FastAPI)

| Component | Responsibility | Use cases |
| --- | --- | --- |
| API gateway | REST endpoints for auth, upload, reports, sharing, consent, deletion | UC-1–UC-3, UC-5, UC-7–UC-10 |
| Streaming handler | WebSocket endpoint; receives audio chunks and pushes updated results | UC-4, UC-6 |
| Auth & consent | Accounts, tokens, consent records; checked before every analysis | UC-1, UC-2 |
| Analysis pipeline | Orchestrates VAD → ASR → risk scoring → explanation; deletes audio at the end of each job | UC-3, UC-4 |
| ASR service | Russian, Kazakh and code-switched transcription (faster-whisper) | UC-3, UC-4 |
| Risk model service | Indicator detection per segment and risk score (XLM-RoBERTa on ONNX Runtime) | UC-3, UC-4 |
| Explanation builder | Links each indicator to the transcript segments that support it | UC-5 |
| Keyword baseline | Rule-based indicator matching, used for evaluation against the model (O3, O6) | — |

### C. Storage

| Store | Contents | Retention |
| --- | --- | --- |
| Report database (PostgreSQL 18) | Users, consents, reports, shares | Until the user deletes them (UC-8) |
| Temporary audio storage | Uploaded files and buffered stream audio | Only while the job runs; deleted on completion or failure |

### D. Offline ML pipeline

The annotated corpus (versioned with DVC) and the training and evaluation code (PyTorch, Transformers, MLflow) run outside the production system. Trained models are exported to ONNX and published to the risk model service as a new version. This pipeline delivers objectives O1–O3 and the model comparison in O6.

## VI. Data

The central entity is the **risk report**; no audio and no full call recording is stored.

| Entity | Main fields |
| --- | --- |
| User | id, credentials, created_at |
| Consent | user_id, scope (analysis, report storage), granted_at, withdrawn_at |
| Report | id, user_id, mode (recording / live), language(s), risk_score (0–100), model_version, created_at |
| Indicator | report_id, type (from the indicator taxonomy, e.g., authority impersonation, urgency, OTP request), confidence |
| Evidence segment | indicator_id, start_ms, end_ms, transcript text |
| Share | report_id, family_member_id, created_at, revoked_at |

`model_version` makes every report traceable to the model that produced it, which the evaluation plan (VRT-10) relies on. Storing the transcript only as evidence segments, rather than the full transcript, limits stored personal data to what the explanation needs.

## VII. Key Scenarios

**A. Uploaded recording (UC-3, UC-5).**
1. The user shares a recording from the dialer; the app checks that consent exists and uploads the file over HTTPS.
2. The API gateway verifies the token and consent, stores the file in temporary storage and submits a job.
3. The pipeline runs VAD and ASR, then the risk model on each segment; the explanation builder links indicators to segments.
4. The report is saved; the audio file is deleted; the app fetches and displays the report.

**B. Live call on speakerphone (UC-4, UC-6).**
1. The user starts live analysis; the foreground service begins capturing microphone audio and opens a WebSocket.
2. Audio chunks are streamed; the server detects completed utterances with VAD, transcribes them and re-scores the conversation so far.
3. After each utterance the server pushes `{risk_score, indicators, segments}`; if the score crosses the warning threshold, the app shows a warning (UC-6).
4. When the user stops the analysis, the final report is saved and buffered audio is deleted.

**C. Data deletion (UC-8).** The user deletes a report or their account; the API gateway removes the report with its indicators, evidence segments and shares. Withdrawn consent stops new analyses immediately.

## VIII. Deployment

The server runs on a single-node Kubernetes cluster (k3s) with separate deployments for the API (CPU) and the inference services (GPU), so that each can be scaled independently. A GitHub Actions pipeline builds container images, runs tests and deploys. Developers run the same images locally with Docker Compose. All traffic between the app and the server uses TLS.

## IX. Consistency Check

| Check | Result |
| --- | --- |
| Every actor in the context diagram appears in the use case diagram | ✔ User, family member, device dialer. The caller is intentionally not a use case actor: they do not interact with the system |
| Every use case is realised by at least one component | ✔ see Section V tables |
| Every component serves at least one use case or objective | ✔ the keyword baseline serves O3/O6 evaluation only |
| Both analysis modes share one pipeline | ✔ API gateway and streaming handler both submit to the analysis pipeline |
| No component stores audio permanently | ✔ only temporary audio storage holds audio; the database schema has no audio field |
| Diagrams match the chosen stack in VRT-6 | ✔ Kotlin 2.4, Python 3.14, FastAPI, faster-whisper, XLM-RoBERTa/ONNX, PostgreSQL 18, Kubernetes |
| Exclusions respected (no telephony capture, no call blocking, no bank/operator integration) | ✔ no such components or external systems |

## X. Open Points

1. **Requirements mapping.** Functional requirements (VRT-7) will be derived from UC-1–UC-10; this document will then reference FR/NFR IDs instead of proposal objectives.
2. **Family member access.** Whether the family member uses the same app with their own account (as assumed here) or a read-only link must be confirmed by user interviews (VRT-3).
3. **Live warning threshold and latency budget** are set in the verification and evaluation plan (VRT-10).
4. **Job queue.** The draft uses an in-process worker; a dedicated queue (e.g., Redis-based) will be added if load testing shows it is needed.
