# VeriTalk

**Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence**

VeriTalk is a mobile application with a server-side artificial intelligence component that assesses the fraud risk of a phone conversation on the basis of its content and explains the assessment to the user.

## Problem Statement

Telephone fraud based on social engineering causes substantial financial losses in Kazakhstan. Existing countermeasures operate predominantly on call metadata, such as caller number reputation and operator-side blocking, and do not analyse what is said during the call. Content-based detection approaches reported in the literature have not been adapted to the Russian–Kazakh bilingual setting or made available to end users in an explainable form.

## Target Users

- Mobile phone users in Kazakhstan who receive calls in Russian or Kazakh, particularly groups at elevated risk of social engineering.
- Family members who assist vulnerable users in assessing suspicious calls.

## Expected Outcomes

- A functional prototype comprising a mobile application and a server supporting recording-based and near real-time analysis.
- An annotated corpus of Russian and Kazakh phone conversations and a documented taxonomy of fraud indicators.
- A trained risk assessment model evaluated against a rule-based baseline.
- An evaluation report covering classification quality, latency and usability.

## Team

| Member | Area | Responsibilities |
| --- | --- | --- |
| Nikita Vasilenko | Backend | Speech recognition pipeline, server API, streaming analysis mode |
| Danial Seit | Frontend | Mobile client, UX design and prototyping, usability testing; project management |
| Abilkaiyr Ozbekbay | Machine learning | Dataset collection and annotation, risk model development and evaluation |

**Supervisor:** Azamat Serek, PhD, Associate Professor, School of Software Engineering, Astana IT University.

Group SE-2410, Astana IT University.

## Scope

**Included:** analysis of uploaded call recordings; near real-time analysis of calls on speakerphone; Russian and Kazakh, including code-switched conversations; fraud and social engineering risk with indicator-level explanations; no retention of call audio.

**Excluded:** direct capture of call audio from the telephony stack, automatic call blocking, synthetic voice detection, integration with banking or operator systems.

The full proposal is available in [docs/01-proposal.md](docs/01-proposal.md).

## Selected Technologies

| Layer | Technology |
| --- | --- |
| Mobile client | Native Android: Kotlin 2.4, Jetpack Compose |
| Transport | HTTPS (recording upload), WebSocket (streaming) |
| Server API | Python 3.14, FastAPI |
| Speech recognition | Whisper via faster-whisper (CTranslate2), with voice-activity detection; wav2vec 2.0 as evaluated fallback |
| Risk model | Fine-tuned XLM-RoBERTa indicator tagger + scoring, served with ONNX Runtime; keyword baseline |
| ML tooling | PyTorch, Hugging Face Transformers, MLflow (experiments), DVC (data versioning) |
| Data augmentation | Self-hosted open-weight LLM (offline only) |
| Storage | PostgreSQL 18; audio kept only in temporary files and deleted after analysis |
| Deployment | Kubernetes (k3s) with GitHub Actions CI/CD; Docker Compose for local development |

The rationale for each choice is given in [docs/05-technology-comparison.md](docs/05-technology-comparison.md).

## Current Status

Pre-defense 1 stage: analysis and design. The repository contains documents and diagrams; application code starts after pre-defense 1. Milestones, owners and risks are listed in [docs/09-risks-and-management.md](docs/09-risks-and-management.md).

## Project Links

- YouTrack project: <https://veritalk.youtrack.cloud/issues/VRT>
- [Project proposal](docs/01-proposal.md)
- [Literature review](docs/03-literature-review.md)
- [Existing system comparison](docs/04-existing-systems.md)
- [Technology comparison](docs/05-technology-comparison.md)
- [Architecture description](docs/07-architecture.md) and [diagrams](diagrams/)
- [Project management and risks](docs/09-risks-and-management.md)
