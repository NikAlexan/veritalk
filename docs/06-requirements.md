# Requirements Specification

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-7 Requirements specification
**Date:** Oct. 21, 2026
**Status:** Draft for pre-defense 1. Numeric targets marked *(P)* are preliminary and will be confirmed in the verification and evaluation plan (VRT-10).

## I. Purpose and Sources

This document lists what VeriTalk must do (functional requirements) and how well it must do it (non-functional requirements). It is derived from four sources:

1. **Interviews** (6 participants, Oct. 18–21, 2026; raw notes in [evidence/interview-notes.md](evidence/interview-notes.md), summary in [02-relevance-evidence.md](02-relevance-evidence.md)). Findings are listed in Section II as F1–F15.
2. **Proposal** ([01-proposal.md](01-proposal.md)): objectives O1–O6, scope and exclusions.
3. **Existing system comparison** ([04-existing-systems.md](04-existing-systems.md)): the gaps in language support, explainability and access.
4. **Architecture** ([07-architecture.md](07-architecture.md)): use cases UC-1–UC-8, data model and components.

## II. Findings from Interviews

*Verified* means a participant said it. The last column shows how many of the six participants (S1–S6, as numbered in the raw notes) said it, so the strength of each finding is visible. The sample is small (six people, five students and one IT operator, no older adults) and was chosen by convenience, so findings are indicative and not representative.

| ID | Finding | Participants | Label |
| --- | --- | --- | --- |
| F1 | Scam calls reach participants or their families regularly; one participant nearly fell for one; S5 reports frequent spam calls | S1, S2, S3 (3/6); S5 spam only | verified |
| F2 | Number-based tools err in both directions: a spoofed local number passed the filter (S1); legitimate delivery drivers were blocked (S2) | S1, S2 (2/6) | verified |
| F3 | Ignoring or silencing all unknown numbers causes missed legitimate calls (recruiters, couriers, job interviews) | S4, S5 (2/6) | verified |
| F4 | Under psychological pressure a participant could not quickly tell whether the caller was a real official (S3: stressed during exams, caller knew his full name); S2 relies only on common sense | S3 (1/6); S2 as context | verified |
| F5 | Existing apps are avoided or removed because of permissions, battery drain, contact-book access or false positives | S2, S3, S4 (3/6) | verified |
| F6 | Participants welcome analysis of what is said during the call | S2, S5, S6 explicitly; S1, S4 by stated willingness to use it (5/6) | verified |
| F7 | Users want to see why: the triggering words or phrases, not only a label | S1, S4, S6 (3/6) | verified |
| F8 | Speakerphone analysis is acceptable, with conditions (suspected scam, helping parents, private setting; awkward in public) | S1, S2, S6 (3/6) | verified |
| F9 | Uploading a recording after the call is preferred as a microphone-privacy alternative | S4 (1/6) | verified |
| F10 | Speed matters: an analysis that takes about 30 s is too slow to help | S5 (1/6) | verified |
| F11 | Strong expectations on deletion and anonymity: audio deleted immediately (S1), audio not linked to the user's phone number in any database (S5), visible "audio deleted" confirmation after every session (S6); S3 cares less about privacy | S1, S5, S6 (3/6); S3 contrary | verified |
| F12 | Scammers mix Kazakh and Russian (Russian with Kazakh switches; Kazakh start, Russian for banking terms) | S2, S6 (2/6) | verified |
| F13 | The warning must be very simple and conspicuous (a large red screen) | S3 (1/6) | verified |
| F14 | Parents are frequent targets and the participant helps them during calls | S1 (1/6) | verified |
| F15 | Processing should be strictly local on the phone (or audio deleted immediately) | S1 (1/6) | verified |

**Assumptions not tested by the interviews.**

| ID | Assumption | Why untested |
| --- | --- | --- |
| A1 | Relatives want to view reports shared by the user (UC-7, UC-8) | Only F14 points to it indirectly |
| A2 | Older adults would use speakerphone or upload | No older participant |
| A3 | Server-side processing is acceptable to users | F15 contradicts it; others did not address it |
| A4 | A default warning threshold of 70 balances missed scams and false alarms | Needs evaluation data (VRT-10) |

## III. Conventions

- **Priority (MoSCoW).** *Must*: required for the prototype to meet proposal objectives O1–O6. *Should*: important, included if time allows. *Could*: optional.
- **Trace.** Each requirement cites at least one finding (F), proposal objective (O), use case (UC), constraint (C) or the proposal section. Requirements that no interview covers (for example, data and model work) trace to the proposal.
- **Acceptance criterion.** Every Must requirement has a criterion that can be checked by an automated test, a measurement or an inspection. Should and Could requirements have shorter criteria.
- **Numbers.** Non-functional targets are numeric. *(P)* marks values to be finalised in VRT-10.

## IV. Functional Requirements

### A. Consent and privacy

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| FR-1 | The app shall obtain the user's explicit consent to call analysis before any audio is sent, and shall not analyse without it | Must | F11, UC-1 | With analysis consent off, the recording endpoint and the live endpoint return 403 `consent_required` and the app does not start audio capture; with consent on, both work (API test and UI check) |
| FR-2 | The app shall keep separate consents for analysis and for report storage, and the user shall be able to withdraw either at any time with immediate effect | Must | F11, UC-1 | Two independent toggles exist; after withdrawing analysis consent the next analysis request is rejected within 5 s; after withdrawing storage consent no new report is stored (API test) |
| FR-3 | Before the first analysis the app shall state in plain language that analysis runs on the VeriTalk server, that audio is deleted after analysis, and what is stored | Must | F11, F15, A3 | The consent screen contains all three statements (checklist review in the user's language) |
| FR-14 | After every analysis, whether it succeeds, fails or is cancelled, the app shall confirm "audio deleted" | Must | F11 | The confirmation is shown only when the server response has `audio_deleted = true`; checked for the three outcomes |
| FR-15 | A report shall be saved only if storage consent is given; otherwise it is shown once and discarded | Must | F11, UC-5 | With storage consent off, the report is visible after analysis but absent from history and database; with it on, present in both |
| FR-17 | The user shall be able to delete one report or all reports and personal data | Must | F11, UC-6 | After "delete all", the database holds zero rows for the user in reports, indicators, evidence segments and shares; a later GET returns 404; completes within 60 s |

### B. Analysis

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| FR-4 | The user shall be able to submit a call recording (m4a, mp3, wav) from the share function of the dialer or a file picker | Must | F9, F3, O4, O5, UC-2 | Three test files (m4a, mp3, wav; 30–120 s) each produce a report; an unsupported format is rejected with a message |
| FR-5 | The user shall be able to start live analysis of a call on speakerphone; the app captures microphone audio in a foreground service with a persistent notification | Must | F8, F6, F3, O5, UC-3 | On a physical Android device a live session runs from start to final report, and the notification is visible while the microphone is in use |
| FR-6 | During live analysis the app shall update the risk score and detected indicators after each completed utterance | Must | F6, F10, O4, UC-3 | In a scripted 60 s call, updates arrive for at least 90% of completed utterances (WebSocket log compared to the script) |
| FR-7 | When the score reaches the warning threshold (default 70 *(P)*, set in server configuration), the app shall warn the user once per call and state the reason | Must | F4, F7, UC-4 | A scripted scam call reaching 70 triggers exactly one warning with a reason; a scripted legitimate call triggers none |
| FR-8 | The warning shall be a large, high-contrast, full-width alert with a one-sentence reason and a dismiss control | Should | F13, F4 | Manual review: the alert spans the full screen width, uses text of at least 18 sp and shows the reason; user reaction is measured in NFR-12 |
| FR-13 | The system shall process Russian, Kazakh and code-switched calls and report the detected language(s) | Must | F12, O2, C-5 | Test samples in Russian, Kazakh and mixed language are processed without error and the report names the language(s); WER is reported per language (MR-3) |
| FR-18 | For recordings the app shall show progress and clear error messages (unsupported format, no speech detected, file too long) | Should | F10 | Each of the three error cases produces a distinct message in a manual test |

### C. Report and explanation

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| FR-9 | Each report shall contain a risk score (integer 0–100) and a level: Low (< 40), Medium (40–69), High (≥ 70) | Must | O3, UC-5 | Schema test on 20 reports: score and level present and consistent |
| FR-10 | Each report shall list the detected indicators from the documented taxonomy, each with a confidence value | Must | F7, O3 | Schema validation: every indicator has a taxonomy type and a confidence in [0, 1] |
| FR-11 | Each indicator shall be linked to at least one supporting transcript segment with start time, end time and text | Must | F7, O3 | In a 20-report test set every indicator has at least one segment, and its text appears in the transcript at those timestamps |
| FR-12 | The app shall highlight the specific trigger words or phrase inside the supporting segment | Should | F7 | In a manual review of five reports the highlighted phrase matches the indicator |
| FR-16 | The user shall be able to list and open saved reports | Must | UC-5 | History shows saved reports newest first and opens the detail view |

### D. Accounts, sharing and interface

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| FR-21 | The user shall be able to register and sign in | Must | UC-1–UC-8 (precondition) | A new user can register and sign in; a request without a valid token returns 401 |
| FR-22 | The interface and warning texts shall be available in Russian | Must | Proposal §IV | String audit: no untranslated strings in the Russian build |
| FR-23 | The interface shall also be available in Kazakh | Should | Proposal §IV, F12 | String audit: no untranslated strings in the Kazakh build |
| FR-19 | The user shall be able to share a report with a family member and revoke the share | Should | F14, A1, UC-7 | After sharing, the family member sees the report; after revoking, access returns 403 |
| FR-20 | A family member shall be able to view a shared report read-only, without audio | Should | F14, A1, UC-8 | The shared view has no share, delete or audio controls |
| FR-24 | The interface could also be available in English | Could | Proposal §III | String audit of the English build |
| FR-25 | The user could adjust the warning sensitivity | Could | F2, A4 | Changing the setting changes the threshold used for the user's warnings |

## V. Non-Functional Requirements

### A. Performance and accuracy

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| NFR-1 | In live mode the updated score shall reach the screen within 5 s of the end of an utterance (95th percentile) *(P)* | Must | F10, O4 | Measured over at least 50 utterances in scripted live calls on the reference deployment (GPU inference node, client round-trip ≤ 100 ms): p95 ≤ 5 s |
| NFR-2 | A recording shall be processed in at most half of its duration (95th percentile) for recordings up to 5 min, that is, ≤ 30 s for 60 s of audio *(P)* | Should | F10, O4 | Measured over 20 recordings: p95 ≤ 0.5 × duration |
| NFR-3 | The server shall handle at least 5 concurrent live sessions while meeting NFR-1 *(P)* | Should | O4 | Load test with 5 simulated sessions: NFR-1 still met |
| NFR-4 | At the default threshold, at most 10% of legitimate calls in the held-out set shall score 70 or higher *(P)* | Should | F2, A4 | Computed on the held-out test set and reported in the evaluation report |

### B. Security and privacy

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| NFR-5 | All client–server traffic shall use TLS 1.2 or newer | Must | Proposal §VIII, 07-architecture §IX | Plain HTTP is refused; an SSL scan of the deployment shows no protocol below TLS 1.2 |
| NFR-6 | No audio shall be stored persistently; audio is held only in temporary storage and deleted within 60 s of job completion, failure, cancellation or client disconnect | Must | F11, F15, Proposal §VIII | Automated tests for the four cases show an empty temporary storage within 60 s; the database schema has no audio field; sampled backups and logs contain no audio |
| NFR-7 | No full transcript shall be stored; only the evidence segments of saved reports, and logs shall contain no transcript or audio content | Must | F11, 07-architecture §VII | The database contains no full-transcript field; inspection of 20 server log files finds no transcript text |
| NFR-8 | The app shall request only the permissions it needs: microphone, internet, notifications and foreground service; no contacts, call log or phone-state access | Must | F5, F11 | Static check of the Android manifest; the data model has no caller phone number or contact field |
| NFR-9 | Every protected endpoint shall reject missing, malformed and expired tokens | Must | UC-1–UC-8 | An automated test over the full route list returns 401 for each invalid-token case |
| NFR-10 | Speech recognition and risk models shall run on project-controlled servers; no audio or text is sent to third-party services | Must | F15, F11, A3 | Review of configuration and egress rules, and a traffic capture during one analysis, show no such requests |
| NFR-11 | Registration shall not require the user's phone number, and reports shall not store the caller's number | Should | F11 | Registration form and data model review |

### C. Usability

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| NFR-12 | The high-risk warning shall be noticed and understood | Must | F13, F4, O6 | In usability testing with at least 5 participants, at least 80% notice a simulated warning and state its reason within 5 s |
| NFR-13 | Core tasks shall be completable without help | Should | O6 | At least 80% of participants analyse a recording and open the report unaided within 3 min |
| NFR-14 | Live analysis shall start in at most 2 taps from the home screen after consent | Should | F13, F5 | UI inspection |
| NFR-15 | Text shall be readable: warning text at least 18 sp, body text at least 14 sp, contrast at least 4.5:1 | Should | Proposal §IV (older adults) | Accessibility scanner report on the main screens |

### D. Resources, compatibility and operation

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| NFR-16 | Live analysis shall use at most 5% of battery per 10 min *(P)* | Should | F5 | Mean of 3 runs on the reference device with the screen on |
| NFR-17 | The app shall run on Android 10 or newer | Must | O5 | The app installs and completes UC-2 and UC-3 on at least 2 physical devices from different manufacturers |
| NFR-18 | When the connection is lost during live analysis, the app shall notify the user within 10 s, keep the last score and resume after reconnection | Should | UC-3 | Toggling airplane mode during a session produces the notice, no crash and automatic resume |
| NFR-19 | The full system shall start locally with Docker Compose | Should | 07-architecture §IX | A fresh clone and `docker compose up` bring up API, database and a mock inference service within 15 min, following the README |

## VI. Data and Model Requirements

| ID | Requirement | Priority | Trace | Acceptance criterion |
| --- | --- | --- | --- | --- |
| MR-1 | A keyword (rule-based) baseline shall produce a score and indicators for the same test set as the model | Must | O3 | Baseline outputs exist for every test sample |
| MR-2 | The risk model shall achieve a higher F1 score than the baseline on the held-out test set, reported separately for Russian and Kazakh | Must | O3, F6 | The evaluation report shows F1 for both systems and both languages, with the model above the baseline in each |
| MR-3 | Word error rate shall be measured on a held-out test set and reported separately for Russian and Kazakh | Must | O2, F12 | The evaluation report contains WER per language with the test-set size |
| MR-4 | The corpus shall contain at least 300 annotated transcripts, at least 100 of them Kazakh or mixed, annotated according to the documented indicator taxonomy | Must | O1, F12 | The dataset manifest shows the counts, and the taxonomy document exists |
| MR-5 | Every report shall record the version of the model that produced it | Must | 07-architecture §VII | Schema test: 100% of reports have `model_version` |

## VII. Constraints

| ID | Constraint | Source |
| --- | --- | --- |
| C-1 | The app informs the user and never blocks, ends or records calls (the decision stays with the user) | Proposal, Exclusion 2; F3 |
| C-2 | Call audio comes from a shared recording or the microphone, not from the telephony stack | Proposal, Exclusion 1 |
| C-3 | Synthetic (cloned) voice detection is out of scope | Proposal, Exclusion 3 |
| C-4 | No integration with bank or operator systems, and no number-based spam detection | Proposal, Exclusions 4–5 |
| C-5 | Supported call languages are Russian and Kazakh | Proposal, Exclusion 6; F12 |
| C-6 | Analysis runs on the server, not on the phone | 07-architecture |

## VIII. Conflicts and Decisions

| ID | Conflict | Decision | Consequence |
| --- | --- | --- | --- |
| D1 | F15 (local processing) versus C-6 (server-side ASR and models) | Keep server-side processing: Kazakh recognition and the models are too heavy for a phone at this stage. Compensate with FR-3, FR-14, NFR-6, NFR-7 and NFR-10 | Users like S1 may still decline; on-device processing is future work |
| D2 | F8 (speakerphone) versus F9 (upload only) | Keep both modes (FR-4, FR-5) | Both are developed and tested |
| D3 | F11 (strict privacy) versus S3's indifference | Strict privacy is the default for everyone, with no setting to weaken it | None |
| D4 | F10 (speed) versus accuracy (the timeliness and recall trade-off reported in [1], [2]) | Targets NFR-1 and NFR-4 are preliminary and set from measurements in VRT-10 | Thresholds may change after evaluation |

## IX. Traceability

| Finding | Requirements |
| --- | --- |
| F1 | FR-5, FR-7 (problem relevance for all use cases) |
| F2 | NFR-4, FR-25 |
| F3 | FR-4, FR-5, C-1 |
| F4 | FR-7, FR-8, NFR-12 |
| F5 | NFR-8, NFR-14, NFR-16 |
| F6 | FR-5, FR-6, MR-2 |
| F7 | FR-7, FR-10, FR-11, FR-12 |
| F8 | FR-5, D2 |
| F9 | FR-4, D2 |
| F10 | FR-6, FR-18, NFR-1, NFR-2 |
| F11 | FR-1, FR-2, FR-3, FR-14, FR-15, FR-17, NFR-6, NFR-7, NFR-10, NFR-11 |
| F12 | FR-13, FR-23, MR-3, MR-4, C-5 |
| F13 | FR-8, NFR-12, NFR-14 |
| F14 | FR-19, FR-20 |
| F15 | FR-3, NFR-6, NFR-10, D1 |

## X. Verification of This Document

| Check | Result |
| --- | --- |
| Every requirement has a priority and a trace | ✔ |
| Every Must requirement has an acceptance criterion | ✔ (FR: 17 Must, NFR: 9 Must, MR: 5 Must) |
| Every non-functional requirement is measurable | ✔ Numeric targets in NFR-1 – NFR-6, NFR-12 – NFR-19; pass/fail checks in NFR-7 – NFR-11 |
| Every finding F1–F15 maps to at least one requirement | ✔ Section IX |
| Every use case UC-1–UC-8 is covered by at least one requirement | ✔ UC-1: FR-1–FR-3; UC-2: FR-4; UC-3: FR-5, FR-6; UC-4: FR-7; UC-5: FR-9–FR-11, FR-15, FR-16; UC-6: FR-17; UC-7: FR-19; UC-8: FR-20 |
| No requirement contradicts a proposal exclusion | ✔ Section VII |
| Totals | 25 functional (17 Must, 6 Should, 2 Could), 19 non-functional (9 Must, 10 Should), 5 data and model (5 Must) |

## XI. Open Points

1. **Numeric targets** marked *(P)* are confirmed in VRT-10 after the first measurements.
2. **Family member access** (A1) needs a follow-up question to participants; FR-19 and FR-20 stay Should until then.
3. **Older adults** are not represented in the interviews (A2). At least one conversation with an older person or a helper of one would strengthen the evidence.
4. **Indicator taxonomy** (FR-10, MR-4) is defined in the corpus work (O1); the requirement list will reference its final names.
5. **Interface details** such as endpoint paths, the `403 consent_required` response and the `audio_deleted` field are proposals to agree with the backend (VRT-7 owner review), and the minimum Android version (NFR-17) is to be confirmed with the mobile client.

## References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.


[2] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*.