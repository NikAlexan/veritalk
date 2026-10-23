# Verification and Evaluation Plan

**Project:** VeriTalk - Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence  
**Task:** VRT-10 Verification and evaluation plan  
**Date:** Oct. 24, 2026  
**Status:** Draft for pre-defense 1

## I. Purpose

This plan defines how VeriTalk will be tested against [06-requirements.md](06-requirements.md) and how objectives O1-O6 from [01-proposal.md](01-proposal.md) will be evaluated.

Verification checks whether the system was built according to its requirements. Evaluation measures whether it identifies fraud better than a simple baseline, works quickly enough, protects user data and can be used by prospective users.

The plan covers the Android client, REST API, WebSocket streaming, audio-processing pipeline, database, risk model and baseline. Direct call capture, call blocking and bank/operator integrations are excluded.

## II. Test Levels

| Test type | Purpose | Main tools / conditions |
| --- | --- | --- |
| Unit | Check isolated business logic | Python tests, Kotlin tests |
| Integration | Check API, database, pipeline and client contracts | Docker Compose, test database, mock inference |
| System | Check complete user scenarios | Physical Android device and deployed server |
| Security/privacy | Check authentication, TLS, permissions and deletion | Route tests, schema inspection, traffic capture |
| Performance | Check latency, throughput and battery use | Reference GPU, Android device, scripted calls |
| User testing | Check comprehension and usability | At least five prospective users |

## III. Test Catalogue

| ID | Test | Result |
| --- | --- | --- |
| UT-01 | Consent, authentication and threshold logic | Correct status codes, score bands and warning behaviour |
| UT-02 | Audio validation and cleanup | Supported files accepted; temporary audio deleted after every outcome |
| UT-03 | Report and explanation validation | Indicators have confidence, timestamps and supporting text |
| UT-04 | Data model validation | No audio/full transcript fields; every report has `model_version` |
| IT-01 | REST API and client contract | Registration, login, consent, upload, reports and errors work together |
| IT-02 | Recording pipeline | Upload -> VAD/ASR -> scoring -> report -> deletion |
| IT-03 | Streaming pipeline | Audio chunks -> WebSocket updates -> final report |
| IT-04 | Storage, deletion and sharing | Consent controls persistence; delete/revoke operations work |
| IT-05 | Local deployment | Fresh clone starts API, database and mock inference with Docker Compose |
| ST-01 | Recording analysis | m4a, mp3 and wav files produce explained reports |
| ST-02 | Live analysis | Speakerphone session runs on a physical device with foreground notification |
| ST-03 | Warning behaviour | Scam script produces one warning; legitimate script produces none |
| ST-04 | Language support | Russian, Kazakh and mixed samples are processed and labelled |
| ST-05 | Account and privacy lifecycle | Consent, history, deletion and audio-deletion confirmation work |
| ST-06 | Device compatibility | Core scenarios complete on two Android 10+ devices |
| SEC-01 | Transport and endpoint security | TLS 1.2+, token validation and protected routes are enforced |
| SEC-02 | Data privacy inspection | No audio, caller number or full transcript in database, logs or traffic |
| PT-01 | Classification evaluation | Model and baseline are measured on the same held-out test set |
| PT-02 | ASR evaluation | WER is measured separately for Russian and Kazakh |
| PT-03 | Live latency and updates | At least 50 utterances; p50 and p95 latency are reported |
| PT-04 | Load, battery and reconnection | Five live sessions, battery use and network-loss behaviour are measured |
| US-01 | Usability test | At least five users complete warning and report tasks |

## IV. Dataset and Baseline

The corpus must contain at least 300 annotated transcripts, including at least 100 Kazakh or mixed Kazakh-Russian transcripts. Each item contains language, fraud/legitimate label, indicator labels, evidence spans and source type.

The data is divided into train, validation and locked held-out test sets. Recordings from the same speaker or scenario remain in one split. Synthetic data may be used for training augmentation but is reported separately and is not used as the only test data.

The baseline is a deterministic keyword and phrase matcher. It detects authority impersonation, urgency, threats, requests for codes or card data, money transfers, loans, remote-access software and secrecy. It receives the same transcripts and labels as the trained model, produces indicators and evidence spans, and uses fixed weights selected before the final test.

## V. Metrics and Conditions

### A. Speech recognition

Report Word Error Rate separately for Russian, Kazakh and mixed speech:

`WER = (S + D + I) / N`

The report includes the test-set size, audio conditions and model version.

### B. Risk classification

For the trained model and baseline report precision, recall, F1, support and confusion matrices for fraud versus legitimate conversation and for each fraud-indicator type. Results are separated by Russian, Kazakh and mixed-language subsets.

Macro F1 is the primary comparison metric. MR-2 passes only if the trained model has higher F1 than the baseline for both Russian and Kazakh.

### C. Performance targets

| Metric | Target |
| --- | --- |
| Live score update | p95 <= 5 seconds after utterance end *(P)* |
| Recording processing | p95 <= half of audio duration, for recordings up to 5 minutes *(P)* |
| Concurrent live sessions | At least 5 while latency target remains satisfied *(P)* |
| Legitimate-call warnings | At most 10% at score >= 70 *(P)* |
| Audio deletion | Within 60 seconds after success, failure, cancellation or disconnect |
| Battery use | At most 5% per 10 minutes *(P)* |

Measurements use the reference server, GPU, Android device and network. Warm-up runs are excluded. The report contains p50, p95, sample count and environment details.

### D. Explanation and usability

Every indicator must have a confidence value and a timestamped evidence segment. At least 20 reports are manually checked for correct indicator-to-text linkage and absence of invented evidence.

At least five users test consent, live analysis, warning comprehension and recorded-call analysis. The main usability target is that at least 80% notice the warning and explain its reason within five seconds. A secondary target is that at least 80% analyse a recording and open its report without help within three minutes.

## VI. Requirement Traceability

Every Must requirement is mapped below to a test or inspection.

### A. Functional requirements

| Requirement | Test / inspection | Pass condition |
| --- | --- | --- |
| FR-1 | UT-01, IT-01 | Analysis without consent returns `403 consent_required` |
| FR-2 | UT-01, IT-01 | Analysis and storage consent are independent and withdrawal is immediate |
| FR-3 | ST-05 | Consent screen explains server processing, deletion and stored data |
| FR-4 | IT-02, ST-01 | m4a, mp3 and wav produce reports; unsupported format is rejected |
| FR-5 | IT-03, ST-02 | Live analysis completes on a physical device with notification |
| FR-6 | IT-03, PT-03 | Updates arrive for at least 90% of completed scripted utterances |
| FR-7 | UT-01, ST-03 | Scam call produces one threshold warning; legitimate call produces none |
| FR-9 | UT-03, ST-01 | Score is 0-100 and risk level is consistent |
| FR-10 | UT-03, ST-01 | Every indicator has taxonomy type and confidence in [0,1] |
| FR-11 | UT-03, ST-01 | Every indicator has a valid supporting segment |
| FR-13 | ST-04, PT-02 | Russian, Kazakh and mixed calls process successfully and language is reported |
| FR-14 | UT-02, ST-05 | Audio-deleted confirmation is shown only after verified deletion |
| FR-15 | IT-04, ST-05 | Reports are stored only with storage consent |
| FR-16 | IT-04, ST-05 | Saved reports are listed newest first and can be opened |
| FR-17 | IT-04, ST-05, SEC-02 | Delete operations remove reports and dependent data |
| FR-21 | IT-01, ST-05 | Registration and login work; invalid token returns 401 |
| FR-22 | ST-04, US-01 | Russian interface has no untranslated strings |

FR-8, FR-12, FR-18, FR-19, FR-20, FR-23, FR-24 and FR-25 are Should/Could requirements. They are checked during system and usability testing where implemented.

### B. Non-functional requirements

| Requirement | Test / inspection | Pass condition |
| --- | --- | --- |
| NFR-1 | PT-03 | Live update p95 <= 5 seconds *(P)* |
| NFR-5 | SEC-01 | TLS 1.2+ is enforced; plain HTTP is refused |
| NFR-6 | UT-02, SEC-02 | No persistent audio; deletion within 60 seconds |
| NFR-7 | UT-04, SEC-02 | No full transcript in database or logs |
| NFR-8 | SEC-02 | Manifest requests only required permissions |
| NFR-9 | UT-01, SEC-01 | Protected endpoints reject invalid tokens |
| NFR-10 | SEC-02 | No audio/text is sent to third-party services |
| NFR-12 | US-01, ST-03 | At least 80% notice and understand the warning within 5 seconds |
| NFR-17 | ST-06 | Core scenarios work on two Android 10+ devices |

NFR-2, NFR-3, NFR-4, NFR-11, NFR-13, NFR-14, NFR-15, NFR-16, NFR-18 and NFR-19 are checked by PT-04, ST-05, ST-06, SEC-02 and IT-05 where applicable.

### C. Data and model requirements

| Requirement | Test / inspection | Pass condition |
| --- | --- | --- |
| MR-1 | PT-01 | Baseline produces a score and indicators for every test sample |
| MR-2 | PT-01 | Trained model F1 exceeds baseline F1 for Russian and Kazakh |
| MR-3 | PT-02 | WER is reported separately for Russian and Kazakh |
| MR-4 | Dataset audit | At least 300 transcripts, including at least 100 Kazakh or mixed |
| MR-5 | UT-04, IT-04 | 100% of saved reports contain `model_version` |

## VII. Demonstrating the Project Aim

The aim is considered achieved when the final release candidate demonstrates:

| Objective | Required evidence |
| --- | --- |
| O1 | Dataset audit confirms corpus size, language composition and taxonomy |
| O2 | PT-02 confirms Russian and Kazakh ASR evaluation |
| O3 | PT-01 confirms model-versus-baseline improvement and explanations |
| O4 | ST-01, ST-02 and PT-03 confirm recording and near-real-time modes |
| O5 | ST-01, ST-02 and ST-06 confirm the three mobile scenarios |
| O6 | Final report contains classification, latency and usability results |

An objective is marked **Complete** only when its required evidence is available and no related Must requirement has failed. Failed requirements are reported with their impact and mitigation.

## VIII. Test Records

Every result records the test ID, requirement ID, date, code/model/data version, environment, input set, expected result, observed result, status and evidence link.

The final evaluation report must include the dataset manifest, baseline configuration, metric tables, latency measurements, privacy checks, device list, usability results and the final objective status table.

## IX. References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.

[2] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*.
