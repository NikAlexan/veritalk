# Project Management and Risks

**Project:** VeriTalk. Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-11 Project management and risks
**Date:** Oct. 20, 2026
**Status:** Draft for pre-defense 1

## I. Management Approach

The team combines a phase-based plan for the whole diploma year with short iterative cycles inside each phase.

The phase structure follows the PM² methodology of the European Commission [1]. PM² divides a project into four phases (Initiating, Planning, Executing and Closing), and runs monitoring and control across all of them [1]. Three review and approval gates separate the phases: Ready for Planning at the end of Initiating, Ready for Executing at the end of Planning, and Ready for Closing at the end of Executing [1]. VeriTalk maps the gates onto the academic calendar:

- Ready for Planning: the supervisor approved the individual work plans and the team merged the proposal (VRT-2, Oct. 18, 2026).
- Ready for Executing: pre-defense 1 (Oct. 24, 2026), where the committee reviews the analysis and design.
- Ready for Closing: the final pre-defense (May 2027), where the committee reviews the finished prototype and evaluation.

Pre-defense 2 falls inside the Executing phase and works as an interim review.

Inside a phase, the team works in one-week cycles that end with the weekly supervisor meeting. Each cycle takes tasks from the YouTrack backlog, delivers them through reviewed pull requests, and closes with a review of progress and risks. Dong et al. reviewed 80 papers and defined agile project management as a management approach in its own right, separate from traditional frameworks and from software-specific agile practices [2]. VeriTalk applies it to planning and control of the project. The team chose short cycles because two parts of the project have high uncertainty that a fixed plan cannot remove in advance: the size and quality of the Russian-Kazakh corpus, and the speech recognition accuracy on speakerphone audio.

The literature on software project risk points the same way. A systematic review of risk management in software development found that research since 2016 concentrated on agile methods and on building risk management into the development process itself [3]. A survey of 1,868 practitioners in agile IT projects produced a risk management model built on four factors for handling project risks [4]. Following these findings, VeriTalk reviews risks inside the weekly cycle instead of in a separate, occasional activity (Section VI).

## II. Organisation and Roles

PM² separates three layers of roles: a directing layer that owns the business case, a managing layer that plans, monitors and controls the work, and a performing layer that produces the deliverables [1]. The project manager sits in the managing layer and runs risk management for project risks [1]. In VeriTalk the roles are as follows.

| Role | Person | Duties |
| --- | --- | --- |
| Supervisor (directing) | Azamat Serek, PhD | Reviews deliverables and decisions at the weekly meeting; approves the individual work plans; has access to YouTrack and the repository |
| Project manager (managing) | Danial Seit | Runs the weekly meeting, keeps the YouTrack plan current, owns the risk register, prepares supervisor reviews |
| Core team (performing) | Nikita Vasilenko, Danial Seit, Abilkaiyr Ozbekbay | Deliver the work in their technical areas and review each other's pull requests |
| Committee | School of Software Engineering | Evaluates the project at each pre-defense |

Each member owns one technical area. The areas come from the proposal (Table I) and the individual work plans approved by the supervisor.

**TABLE I. Technical Areas**

| Member | Area | Owns during the diploma project |
| --- | --- | --- |
| Nikita Vasilenko | Backend and DevOps | Server API, analysis pipeline integration (VAD, ASR, risk scoring, explanation), streaming mode, report storage, deployment (k3s, GitHub Actions) |
| Danial Seit | Frontend, project management | Android client, UX design and prototype, user interviews and usability testing, supervisor meetings |
| Abilkaiyr Ozbekbay | Machine learning | Indicator taxonomy, corpus collection and annotation, ASR model selection and evaluation, risk model, keyword baseline, inference service |

Two areas share speech recognition. Abilkaiyr selects, fine-tunes and evaluates the ASR model and reports WER per language. Nikita runs that model inside the server pipeline and owns its latency in streaming mode. The two agree on the model interface (input audio format, output segments with timestamps) before implementation starts.

## III. Responsibility Assignment

The team records responsibilities in a RASCI matrix, the form of responsibility assignment matrix that PM² uses [1]:

- **R** (Responsible) does the work. Each task has one R.
- **A** (Accountable) is answerable for the correct and thorough completion of the work. Each task has one A; in a team of three the A is also the R.
- **S** (Supports) works with the R and helps complete the task.
- **C** (Consulted) gives an opinion in two-way communication but does not help complete the task. In VeriTalk this is usually the pull request reviewer or the supervisor.
- **I** (Informed) is kept informed of progress.

**TABLE II. RASCI Matrix for Pre-defense 1**

| # | Deliverable | YouTrack | Nikita | Danial | Abilkaiyr | Supervisor | Due |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Project proposal, `docs/01-proposal.md` | VRT-2 | S | A/R | S | C | Done Oct. 18 |
| 2 | Evidence of relevance, `docs/02-relevance-evidence.md` | VRT-3 | C | A/R | S | I | Oct. 21 |
| 3 | Literature review, `docs/03-literature-review.md` | VRT-4 | A/R | I | C | C | Oct. 21 |
| 4 | Existing system comparison, `docs/04-existing-systems.md` | VRT-5 | C | I | A/R | C | Done Oct. 19 |
| 5 | Technology comparison, `docs/05-technology-comparison.md` | VRT-6 | A/R | C | C | C | Done Oct. 20 |
| 6 | Requirements specification, `docs/06-requirements.md` | VRT-7 | A/R | C | S | C | Oct. 22 |
| 7 | Architecture and diagrams, `docs/07-architecture.md` | VRT-8 | A/R | C | C | C | Done Oct. 20 |
| 8 | UX / prototype, `prototype/` | VRT-9 | C | A/R | I | C | Oct. 22 |
| 9 | Verification and evaluation plan, `docs/08-verification-plan.md` | VRT-10 | S | C | A/R | C | Oct. 24 |
| 10 | Project management and risks, this document | VRT-11 | A/R | S | C | C | Oct. 24 |
| 11 | Supervisor feedback, `docs/10-supervisor-feedback.md` | VRT-12 | S | A/R | S | C | Oct. 23 |
| 12 | Submission: tag `pre-defense-1` and summary | VRT-13 | A/R | S | S | I | Oct. 24, 18:00 |

Abilkaiyr supports VRT-7 by writing the measurable requirements for the risk model, which he reuses in VRT-10. Danial supports VRT-11 as the project manager who runs the risk register.

## IV. Planning, Monitoring and Traceability

The plan lives in YouTrack project VRT (<https://veritalk.youtrack.cloud/issues/VRT>). Three epics group the tasks: VRT-14 Analysis and research, VRT-15 Design, VRT-16 Planning, review and pre-defense 1 submission. Each task names its owner, expected outcome, acceptance criteria, due date and estimate, and its Stage field moves from Backlog through Develop and Review to Done.

The GitHub repository (<https://github.com/NikAlexan/veritalk>) holds the code, documents and diagrams, with `main` as the reviewed baseline. Each task follows the same path:

1. The owner creates a branch named after the task, for example `VRT-8-architecture-diagrams`, and starts each commit message with the branch name.
2. The owner opens a pull request that references the task and states how the work was checked.
3. Another team member reviews the pull request before it is merged.
4. The owner links the pull request in the YouTrack task and closes the task once its acceptance criteria are met.

For each pre-defense the team tags the submitted commit (`pre-defense-1`, `pre-defense-2`, `final-pre-defense`) and does not move a tag after submission.

At the weekly meeting the project manager checks three things in YouTrack: tasks past their due date, tasks in Review for more than two days, and changes in the risk register. A task that slips moves to a new due date with a comment that names the reason and the tasks it delays, as done for VRT-3 and VRT-7 on Oct. 20.

## V. Milestones

Table III lists the milestones up to the final defense and maps them to the PM² phases and gates [1]. Pre-defense 1 dates come from YouTrack. Later milestones follow the stages in the approved work plans; the team will add exact dates for pre-defense 2 and the final pre-defense when the School announces them.

**TABLE III. Milestones**

| ID | Phase | Milestone | Date | Owner | Done when |
| --- | --- | --- | --- | --- | --- |
| M0 | Initiating | Proposal approved, gate Ready for Planning | Oct. 18, 2026 | Danial | The proposal is merged (VRT-2) and the supervisor has approved the individual work plans |
| M1 | Planning | Analysis complete | Oct. 21, 2026 | Danial | Interview notes and the literature review are merged (VRT-3, VRT-4) |
| M2 | Planning | Design complete | Oct. 22, 2026 | Nikita | Requirements, architecture and prototype are merged (VRT-6 to VRT-9) |
| M3 | Planning | Supervisor review | Oct. 22, 2026 | Danial | The supervisor has reviewed the drafts; by Oct. 23 each comment has a decision in VRT-12 |
| M4 | Planning | Pre-defense 1, gate Ready for Executing | Oct. 24, 2026, 18:00 (Astana) | Nikita | Tag `pre-defense-1` exists and the form is submitted (VRT-13) |
| M5 | Executing | Specification frozen | Nov. to Dec. 2026 | Nikita | ML task, quality metrics, data collection plan, UI mockups and the API contract are agreed |
| M6 | Executing | Pre-defense 2, interim review | Date set by the School | Nikita | Tag `pre-defense-2` exists and the form is submitted |
| M7 | Executing | Baselines and first build | Jan. to Feb. 2027 | Abilkaiyr | Annotated corpus, baseline ASR and keyword baseline are measured; the client works against a test API |
| M8 | Executing | Integrated prototype | Mar. to Apr. 2027 | Nikita | Both analysis modes run end to end on a physical device with the fine-tuned models (O4, O5) |
| M9 | Executing | Evaluation complete | Apr. 2027 | Abilkaiyr | The evaluation report compares the model with the baseline and includes usability testing with at least five participants (O6) |
| M10 | Closing | Final pre-defense (gate Ready for Closing) and defense | May 2027 | All members | Tag `final-pre-defense` exists; the explanatory note and each member's chapter are submitted |

## VI. Risk Management

### A. Process

The process follows the six steps of the PM² Manage Risks activity [1]:

1. Identify. Any member adds a risk to the register when they see it, at any point in the project. The team also reviews the register at each gate.
2. Assess. The team rates the likelihood and the impact of each risk on the scale in Table IV and computes the risk level.
3. Develop a response. The risk owner picks a strategy and plans the actions. PM² lists four strategies for threats [1]: avoid (change the plan or scope so that the risk no longer applies), reduce (lower the likelihood or the impact), transfer or share (move the risk to a third party), and accept (passive, with monitoring only, or active, with a contingency plan).
4. Control. The owner checks the trigger and the progress of the response every week and updates the register.
5. Record. A response that needs work becomes a YouTrack task in the project plan.
6. Report. The project manager reports changes in the register to the supervisor at the weekly meeting.

The Orange Book groups the same work into identification and assessment, treatment, monitoring and reporting, and notes that the steps are often presented as sequential but in practice are iterative [5]. The weekly review of the register follows from that. In PM², the project manager monitors and controls the risks and the core team helps identify and respond to them [1]; in VeriTalk each risk also has one owner, the person accountable for managing and monitoring it [1].

### B. Assessment Scale

PM² rates likelihood and impact in five bands, multiplies them into a risk level from 1 to 25, and colours the level green (2 or lower), yellow (3 to 16) or red (20 or higher) [1]. Table IV gives the meaning of each band for VeriTalk.

**TABLE IV. Likelihood and Impact Bands**

| Band | Likelihood | Impact |
| --- | --- | --- |
| 1 Very low | Not expected during the project | No effect on any milestone |
| 2 Low | Unlikely within the current phase | Delays one task by less than a week |
| 3 Medium | May happen within the current phase | Delays a milestone by up to two weeks |
| 4 High | Likely within the current phase | Lowers the result of one objective (O1 to O6) below its completion criterion |
| 5 Very high | Expected unless the team acts | Blocks an objective or a pre-defense |

The team discusses red risks and yellow risks with a level of 12 or more at every weekly meeting, and the remaining risks at each gate.

### C. Risk Register

Machine learning projects add data and model risks to the usual software risks. Paleyes et al. surveyed published case studies of ML deployment and found that practitioners meet problems at each stage of the deployment workflow: data management, model learning, model verification and model deployment [6]. Risks R1 and R2 belong to data management, R3 to model learning and verification, and R4 and R5 to deployment; R6 to R11 cover the product, the team and the submission process.

**TABLE V. Risk Register**

| ID | Risk | L | I | Level | Strategy | Response | Trigger | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | The team cannot collect 300 annotated transcripts, 100 of them in Kazakh or mixed speech (O1), because real scam calls in these languages are not publicly available | 4 | 5 | 20 Red | Reduce | Start collection in November; add staged calls recorded by volunteers with consent and synthetic dialogues from the offline LLM; report the share of each source | Fewer than 100 transcripts by the end of December | Abilkaiyr |
| R2 | The model learns patterns of synthetic dialogues and fails on real calls | 3 | 4 | 12 Yellow | Reduce | Keep the test set free of synthetic data; report results separately for real and synthetic subsets | F1 on real calls falls below F1 on synthetic calls by more than 0.1 | Abilkaiyr |
| R3 | Whisper gives a high Kazakh WER on speakerphone audio (O2), and recognition errors lower the risk model's F1 | 3 | 4 | 12 Yellow | Reduce | Measure WER on a small speakerphone test set in M5; fall back to wav2vec 2.0 fine-tuned on KSC2; train the risk model on ASR output as well as clean transcripts | Kazakh WER above the threshold in the evaluation plan | Abilkaiyr |
| R4 | The team has no stable GPU for training and inference | 3 | 5 | 15 Yellow | Reduce | Confirm access to a GPU before M7; keep CPU int8 inference as a fallback for the demonstration; run the augmentation LLM offline only | No confirmed GPU by the start of January | Nikita |
| R5 | Streaming mode misses the latency threshold set in the evaluation plan (O4) | 3 | 3 | 9 Yellow | Reduce | Measure latency on the target GPU in M7; use VAD chunking and a smaller Whisper model; demonstrate recording mode only if the threshold is still missed | Measured latency above the threshold | Nikita |
| R6 | Call audio and transcripts are sensitive personal data, and a leak or retention would break the privacy-by-design scope | 2 | 5 | 10 Yellow | Reduce | Delete audio at the end of every job; store evidence segments only; collect corpus recordings only with written consent of both speakers; test deletion | An audio file found in storage after a job ends | Nikita |
| R7 | Interview evidence comes late or covers fewer than three conversations, so requirements rest on assumptions | 4 | 3 | 12 Yellow | Reduce | Mark untested requirements as assumptions in VRT-7; recruit participants through family members and the university; repeat interviews before pre-defense 2 | Fewer than three documented conversations by Oct. 21 | Danial |
| R8 | The pre-installed dialer on some Android devices does not record calls, so the recording scenario (UC-2) is unavailable to those users | 3 | 3 | 9 Yellow | Accept (active) | Keep the speakerphone scenario (UC-3), which needs the microphone only; list tested devices in the evaluation report | A test device without dialer recording | Danial |
| R9 | Client, server and ML service drift apart because each member builds against a different API | 3 | 3 | 9 Yellow | Reduce | Agree an OpenAPI contract in M5; the member who consumes an interface reviews pull requests that change it | An integration test fails on a contract mismatch | Nikita |
| R10 | A member is unavailable for several weeks, and tasks in their area stop | 2 | 3 | 6 Yellow | Reduce | Review every pull request by another member so that two people know each area; rebalance tasks in YouTrack at the weekly meeting | A member misses two weekly meetings in a row | Danial |
| R11 | The committee cannot open YouTrack or the repository during a pre-defense | 1 | 5 | 5 Yellow | Reduce | Grant committee access before each pre-defense and check the links from an account outside the team | A link check fails on submission day | Nikita |

## VII. Dependencies

Pre-defense 1 tasks depend on each other as recorded in YouTrack:

- VRT-3 (interviews), VRT-4, VRT-5 and VRT-6 feed VRT-7 (requirements).
- VRT-7 feeds VRT-8 (architecture) and VRT-10 (evaluation plan); VRT-8 feeds VRT-9 (prototype).
- VRT-12 (supervisor review) needs the drafts of VRT-2 to VRT-9, and VRT-11 includes its outcome.
- VRT-13 (submission) needs VRT-10 and VRT-11.

The overdue task VRT-3 sits at the start of this chain, so the team finishes it first.

Implementation depends on the following order and external inputs:

| Dependency | Needed by | Owner and milestone |
| --- | --- | --- |
| Indicator taxonomy | Corpus annotation, keyword baseline, report UI | Abilkaiyr, M5 |
| Annotated corpus | Risk model training and evaluation (O1, O3) | Abilkaiyr, M7 |
| ASR model interface | Server pipeline and streaming mode | Abilkaiyr and Nikita, M5 |
| OpenAPI contract | Android client integration | Nikita and Danial, M5 |
| Warning threshold and latency budget | Streaming mode, UC-4 warning | Abilkaiyr, VRT-10 |
| GPU access | ASR fine-tuning, risk model training, inference | Nikita, before M7 |
| Open speech corpora (KSC, KSC2) and open model weights (Whisper, XLM-RoBERTa) | ASR and risk model | Abilkaiyr checks licence terms before use, M5 |
| Usability test participants (at least five) | Evaluation report (O6) | Danial, M9 |

## VIII. Communication

| What | Who | When | Where |
| --- | --- | --- | --- |
| Progress, risks and decisions | Team and supervisor | Weekly meeting, in person or online | Decisions recorded in YouTrack comments |
| Review of a change | Author and reviewer | Each pull request | GitHub pull request |
| Supervisor feedback on drafts | Supervisor and team | Before each pre-defense | `docs/10-supervisor-feedback.md` |
| Submission summary | Committee | Each pre-defense | Tag and summary (VRT-13) |

## References

[1] European Commission, Directorate-General for Digital Services, *PM² Project Management Methodology Guide 3.1*. Luxembourg: Publications Office of the European Union, 2023, doi: 10.2799/970188. [Online]. Available: <https://op.europa.eu/en/publication-detail/-/publication/97cc2f12-c648-11ee-95d9-01aa75ed71a1/language-en>

[2] H. Dong, N. Dacre, D. Baxter, and S. Ceylan, "What is agile project management? Developing a new definition following a systematic literature review," *Project Management Journal*, vol. 55, no. 6, pp. 668–688, 2024, doi: 10.1177/87569728241254095.

[3] M. Pilliang and Munawar, "Risk management in software development projects: A systematic literature review," *Khazanah Informatika*, vol. 8, no. 2, 2022, doi: 10.23917/khif.v8i2.17488.

[4] S. Singh, G. Madaan, A. Singh, K. Sood, S. Grima, and R. Rupeika-Apoga, "The AGP model for risk management in agile I.T. projects," *Journal of Risk and Financial Management*, vol. 16, no. 2, Art. no. 129, 2023, doi: 10.3390/jrfm16020129.

[5] HM Treasury, *The Orange Book: Management of Risk, Principles and Concepts*. London, U.K.: HM Treasury, 2023. [Online]. Available: <https://assets.publishing.service.gov.uk/media/6453acadc33b460012f5e6b8/HMT_Orange_Book_May_2023.pdf>

[6] A. Paleyes, R.-G. Urma, and N. D. Lawrence, "Challenges in deploying machine learning: A survey of case studies," *ACM Computing Surveys*, vol. 55, no. 6, Art. no. 114, 2022, doi: 10.1145/3533378. [Online]. Available: <https://arxiv.org/abs/2011.09926>
