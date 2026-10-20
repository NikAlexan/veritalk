# Technology Comparison

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-6 Technology comparison
**Date:** Oct. 20, 2026

## I. Purpose and Method

This document records the key technical decisions, consistent with the individual work plans approved by the supervisor, for the VeriTalk prototype. For each decision, two or three realistic alternatives are compared against project requirements, and one is chosen. Choices are justified by the requirements below, not by team preference.

The driving requirements are taken from the proposal (`docs/01-proposal.md`) and the existing system comparison (`docs/04-existing-systems.md`):

| ID | Driver | Source |
| --- | --- | --- |
| D1 | Russian and Kazakh speech, including Kazakh–Russian code-switching | Proposal O2, Scope; Gap 1 |
| D2 | Privacy by design: audio is deleted after analysis and is not sent to third parties | Proposal Scope, Assumption 1 |
| D3 | Explainable output: risk score 0–100, detected indicators, supporting transcript segments | Proposal O3; Gap 3 |
| D4 | Two modes: complete recording and near real-time streaming via speakerphone | Proposal O4; Gap 4 |
| D5 | Device- and operator-independent access on Android, the platform targeted by the project (any Android phone, any operator) | Gap 2; supervisor-approved role plans |
| D6 | Measurable quality against a keyword baseline with scarce labelled data | Proposal O1, O3, O6 |
| D7 | Delivery by a three-person student team within one academic year, at near-zero cost | Project constraints |

Each alternative is rated against the relevant drivers: ✔ meets, ◐ partially meets, ✘ does not meet. Claims about third-party products reflect public documentation and must be re-checked during implementation (Section IX).

## II. Decision 1: Speech Recognition (ASR)

| Criterion | A. Whisper (self-hosted, via faster-whisper) | B. Commercial cloud ASR (e.g., Google Cloud Speech-to-Text) | C. wav2vec 2.0 / XLS-R fine-tuned on Kazakh and Russian (e.g., KSC2) |
| --- | --- | --- | --- |
| D1 Russian + Kazakh | ✔ one multilingual model covers both | ◐ both languages offered, but code-switching within one stream requires a fixed primary language | ◐ strong after fine-tuning; needs separate training per language or a joint model |
| D2 Audio stays on our server | ✔ | ✘ audio is sent to a third-party provider | ✔ |
| D4 Streaming | ◐ not natively streaming; achievable with VAD-based chunking | ✔ native streaming API | ✔ CTC models stream naturally |
| D6 Can be adapted / measured | ✔ open weights, fine-tunable, WER measurable | ◐ limited adaptation, measurable | ✔ |
| D7 Cost and effort | ✔ free, runs on one GPU; CPU int8 fallback | ✘ per-minute billing | ◐ fine-tuning effort and labelled audio required |

**Choice: A — Whisper, served with faster-whisper.** It is the only option that satisfies D1 and D2 together: one model handles both languages and mixed speech, and audio never leaves the project server. The missing native streaming (D4) is handled in the architecture by voice-activity-detection chunking (Decision 4). Option C remains the fallback if measured Kazakh WER (O2) is unacceptable on speakerphone audio; it is evaluated alongside Whisper during the baseline stage. For production, the selected model is exported to an optimised runtime (CTranslate2 for Whisper, ONNX Runtime for wav2vec 2.0) to meet the latency budget.

## III. Decision 2: Risk Assessment Model

| Criterion | A. Fine-tuned multilingual encoder (e.g., XLM-RoBERTa) as indicator tagger + scoring | B. Hosted LLM via API with prompting | C. Self-hosted open-weight instruction LLM (7–8B, quantised) |
| --- | --- | --- | --- |
| D2 Transcript stays on our server | ✔ | ✘ transcript sent to provider | ✔ |
| D3 Indicators + evidence segments | ✔ token/sentence-level tagging gives exact supporting segments | ◐ can explain, but evidence may be hallucinated [1] | ◐ same hallucination risk [1] |
| D4 Latency for re-scoring every segment | ✔ milliseconds per segment | ◐ network round trip, rate limits | ◐ seconds per call on a single GPU |
| D6 Works with ~300 labelled transcripts, reproducible evaluation | ◐ small data, but augmentable; deterministic | ✔ zero-shot possible, but non-deterministic and model may change | ◐ few-shot; deterministic with fixed seed |
| D7 Cost | ✔ trains on one GPU | ✘ per-token billing | ◐ needs GPU memory alongside ASR |

**Choice: A as the production model, with C used offline for data augmentation.** A fine-tuned encoder satisfies D2, D3 and D4 directly: each detected indicator is tied to a concrete transcript span, so explanations cannot cite text that was not said. Data scarcity (D6) is the main weakness; it is mitigated by generating additional synthetic scam and legitimate dialogues with the self-hosted LLM (C), which keeps data on our side. The keyword-based baseline required by O3 is implemented separately as a rule list over the same indicator taxonomy. Option B is excluded because it breaks D2.

## IV. Decision 3: Server Platform

| Criterion | A. Python + FastAPI | B. Node.js (NestJS) | C. Go |
| --- | --- | --- | --- |
| Integration with ASR and ML (Decisions 1–2) | ✔ same language as faster-whisper, PyTorch, Transformers | ✘ ML must run in a separate Python service | ✘ same as B |
| D4 WebSocket streaming | ✔ built in (ASGI) | ✔ | ✔ |
| D7 Team skills and effort | ✔ one language for backend and ML | ◐ two stacks to maintain | ◐ two stacks, less team experience |
| API documentation for the mobile client | ✔ OpenAPI generated automatically | ◐ via decorators | ◐ via external tools |

**Choice: A — Python with FastAPI.** The ASR and risk model are Python libraries, so a Python server runs them in-process and avoids an extra network hop and a second codebase, which matters for both D4 latency and D7 effort. CPU-heavy inference runs in a worker process pool so that it does not block the asynchronous request loop.

## V. Decision 4: Client–Server Communication for Streaming

| Criterion | A. WebSocket | B. gRPC bidirectional streaming | C. Repeated HTTP uploads of segments |
| --- | --- | --- | --- |
| D4 Continuous audio up, score updates down | ✔ full duplex on one connection | ✔ | ◐ polling for results, overhead per segment |
| Mobile support (D5) | ✔ native on Android (OkHttp) | ◐ requires HTTP/2 and code generation; harder behind proxies | ✔ |
| D7 Simplicity | ✔ | ◐ | ✔ |

**Choice: A — WebSocket for streaming mode, plain HTTPS (multipart upload) for recording mode.** The client sends 16 kHz mono audio chunks; the server applies voice-activity detection, transcribes completed utterances, re-scores the conversation and pushes an updated `{score, indicators, segments}` message back. Recording mode uses a standard upload endpoint followed by polling or a single result response, which is simpler and sufficient for non-interactive analysis.

## VI. Decision 5: Mobile Client

| Criterion | A. Native Android (Kotlin, Jetpack Compose) | B. Flutter | C. React Native |
| --- | --- | --- | --- |
| D5 Android, any device and operator | ✔ | ✔ | ✔ |
| D4 Low-latency raw PCM capture from the microphone (`AudioRecord`) and a long-running foreground service during a call | ✔ direct platform API | ◐ through plugins / platform channels | ◐ through native modules |
| Access to system integrations (share intent for recordings from the built-in dialer, notifications, permissions) | ✔ direct | ◐ via plugins | ◐ via native modules |
| D7 Team skills (completed Native Mobile Development course; role defined in supervisor-approved plans) | ✔ | ◐ | ◐ |

**Choice: A — native Android in Kotlin with Jetpack Compose.** Streaming analysis (D4) depends on continuous microphone capture in a foreground service while a speakerphone call is in progress, and on receiving recordings shared from the device dialer; both are platform features that Kotlin accesses directly, whereas the cross-platform options reach them only through an extra bridging layer. The project targets Android, where call recordings are produced by the pre-installed dialer (proposal, Scope), so the main advantage of B and C, a shared iOS build, does not apply. iOS support is out of scope for the prototype.

## VII. Decision 6: Data Storage

| Criterion | A. PostgreSQL | B. MongoDB | C. SQLite |
| --- | --- | --- | --- |
| D2 Store reports only, delete audio | ✔ | ✔ | ✔ |
| Structured reports + flexible indicator lists | ✔ relational tables + JSONB | ✔ | ◐ |
| Concurrent access from API workers | ✔ | ✔ | ✘ single writer |
| D7 Familiarity and tooling | ✔ | ◐ | ✔ |

**Choice: A — PostgreSQL.** Reports, users and consents are relational; indicator lists fit in JSONB without a second database. Audio is never written to the database: it is kept in a temporary directory only while a job runs and deleted when the job finishes, which directly implements D2. The annotated corpus (O1) is stored as versioned files outside the production database.

## VIII. Decision 7: Deployment and Delivery

| Criterion | A. Kubernetes with CI/CD (GitHub Actions) | B. Docker Compose on a single server | C. Managed PaaS / serverless |
| --- | --- | --- | --- |
| Separate scaling of API and GPU inference services | ✔ | ✘ one host | ◐ GPU support limited and costly |
| D2 Data stays on infrastructure the team controls | ✔ | ✔ | ◐ provider-managed |
| Reproducible delivery and rollback | ✔ declarative manifests, pipeline | ◐ manual | ✔ |
| D7 Effort | ◐ higher; mitigated by a single-node cluster (e.g., k3s) | ✔ lowest | ◐ |

**Choice: A — Kubernetes (single-node k3s for the prototype) with a GitHub Actions CI/CD pipeline; B is used for local development.** The ASR/risk inference and the API have different resource needs (GPU vs CPU) and must be deployed and scaled separately, which a single Compose host cannot do. Self-hosting keeps audio and transcripts on controlled infrastructure (D2). The same container images run under Docker Compose locally, so developers do not need a cluster.

## IX. Chosen Stack

| Layer | Technology |
| --- | --- |
| Mobile client | Native Android: Kotlin, Jetpack Compose |
| Transport | HTTPS (recording upload), WebSocket (streaming) |
| Server API | Python 3.11+, FastAPI |
| Speech recognition | Whisper via faster-whisper (CTranslate2), with voice-activity detection; wav2vec 2.0 as evaluated fallback |
| Risk model | Fine-tuned XLM-RoBERTa indicator tagger + scoring, served with ONNX Runtime; keyword baseline |
| ML tooling | PyTorch, Hugging Face Transformers, MLflow (experiments), DVC (data versioning) |
| Data augmentation | Self-hosted open-weight LLM (offline only) |
| Storage | PostgreSQL; temporary files for audio, deleted after analysis |
| Deployment | Kubernetes (k3s) with GitHub Actions CI/CD; Docker Compose for local development |

## X. Risks and Items to Verify

1. **Kazakh WER.** Whisper's Kazakh accuracy may be insufficient on telephone-quality speakerphone audio. Mitigation: measure early on a small test set; fall back to or fine-tune with KSC2-based resources (Decision 1, option C).
2. **Streaming latency.** Chunked Whisper adds delay per utterance. The latency threshold from the evaluation plan (VRT-10) must be checked on the target GPU; a smaller Whisper model is the fallback.
3. **GPU memory.** ASR and the risk model must fit on the available GPU together; the augmentation LLM runs offline only, not in production.
4. **Vendor details** (language coverage of cloud ASR, licence terms of model weights) must be re-checked before the final report.

## References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.
