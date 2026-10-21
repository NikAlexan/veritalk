# Evidence of Relevance

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-3 User interviews / client discussions
**Date:** Oct. 21, 2026
**Status:** Draft for pre-defense 1

## I. Overview

To check that VeriTalk addresses real needs and to inform the requirements specification ([06-requirements.md](06-requirements.md)), the team held six semi-structured interviews with potential users between Oct. 18 and Oct. 21, 2026. Each conversation followed the guide in [evidence/00-interview-guide.md](evidence/00-interview-guide.md) (eight questions on the current process, tools, pain points and expectations). Raw notes are in [evidence/interview-notes.md](evidence/interview-notes.md).

This document separates three kinds of statements:

- **Verified:** said by participants in the interviews. The number of participants who said it is given as n/6.
- **Assumption:** not confirmed by the interviews.
- **External source:** taken from statistics, press or literature. It supports the context but is not an interview finding.

## II. Participants

| Code | Role | Date |
| --- | --- | --- |
| S1 | University student | 2026-10-18 |
| S2 | University student | 2026-10-19 |
| S3 | University student | 2026-10-19 |
| S4 | IT operator | 2026-10-20 |
| S5 | University student | 2026-10-20 |
| S6 | University student | 2026-10-21 |

Participants are referred to by codes. Names are kept only in the raw notes, with the participants' agreement.

## III. Findings

All findings below are **verified**. Strength varies: a finding stated by one participant is an observation, not a pattern.

| ID | Finding | Participants |
| --- | --- | --- |
| F1 | Scam calls reach participants or their families regularly (S1: once or twice a month, his parents weekly); one participant nearly fell for one; S5 reports frequent spam calls | S1, S2, S3 (3/6); S5 spam only |
| F2 | Number-based tools err in both directions: a spoofed local number passed the filter (S1); legitimate delivery drivers were blocked, so the app was removed (S2) | S1, S2 (2/6) |
| F3 | Ignoring or silencing all unknown numbers causes missed legitimate calls (recruiters, couriers, job interviews) | S4, S5 (2/6) |
| F4 | Under psychological pressure a participant could not quickly tell whether the caller was a real official (S3: stressed during exams, the caller knew his full name); S2 relies only on common sense, for example when an SMS code is requested | S3 (1/6); S2 as context |
| F5 | Existing apps are avoided or removed because of permissions, battery drain, contact-book access or false positives | S2, S3, S4 (3/6) |
| F6 | Participants welcome analysis of what is said during the call | S2, S5, S6 explicitly; S1, S4 by stated willingness to use it (5/6) |
| F7 | Users want to see why: the triggering words or phrases, not only a label | S1, S4, S6 (3/6) |
| F8 | Speakerphone analysis is acceptable, with conditions: a suspected scam, helping parents, a private setting (awkward in public) | S1, S2, S6 (3/6) |
| F9 | Uploading a recording after the call is preferred as a way to avoid live microphone use | S4 (1/6) |
| F10 | Speed matters: an analysis taking about 30 s would be too slow to help | S5 (1/6) |
| F11 | Strong deletion and anonymity expectations: audio deleted immediately (S1), audio not linked to the user's phone number in any database (S5), a visible "audio deleted" confirmation after every session (S6). S3 cares less about privacy and more about a reliable warning | S1, S5, S6 (3/6); S3 contrary |
| F12 | Scammers mix Kazakh and Russian (Russian with switches to Kazakh; a start in Kazakh to build trust, then Russian for banking terms) | S2, S6 (2/6) |
| F13 | The warning must be very simple and conspicuous (a large red screen) | S3 (1/6) |
| F14 | Parents are frequent targets and the participant helps them during calls | S1 (1/6) |
| F15 | Processing should be strictly local on the phone, or audio deleted immediately | S1 (1/6) |

## IV. Assumptions

### A. Working assumptions of the proposal

The proposal ([01-proposal.md](01-proposal.md), Section III.D) stated three assumptions. They are checked against the interviews below.

| ID | Assumption | Result | Evidence |
| --- | --- | --- | --- |
| W1 | Users accept call analysis if audio is not retained | Partly supported | Acceptance depends on deletion being guaranteed and visible (F11: S1, S5, S6); S1 would prefer local processing (F15); S3 is indifferent |
| W2 | A warning with specific evidence is more credible than an unexplained label | Supported, not contradicted | Three participants asked for the triggering words or phrases (F7); none preferred a bare label |
| W3 | Users will place a call on speakerphone or upload a recording | Partly supported | Speakerphone is acceptable to 3/6 in private settings (F8); one participant prefers upload (F9); public use is awkward |

### B. Assumptions not tested by the interviews

| ID | Assumption | Why untested |
| --- | --- | --- |
| A1 | Relatives want to view reports shared by the user | Only F14 points to it indirectly |
| A2 | Older adults would use speakerphone or upload | No older participant |
| A3 | Server-side processing is acceptable to users | F15 contradicts it; the others did not address it |
| A4 | A default warning threshold of 70 balances missed scams and false alarms | Needs evaluation data (VRT-10) |

### C. Earlier team assumptions corrected by the interviews

| Earlier assumption | Result |
| --- | --- |
| Users can easily spot a scammer on their own | Contradicted by S3 (F4: stress and personal data made him doubt); one participant is not enough to generalise |
| Users will find speakerphone inconvenient | Not supported as stated: F8 (3/6 accept it with conditions) |
| A standard privacy policy is enough to earn trust | Not supported: F11 (users want visible guarantees such as a deletion confirmation) |

## V. External Sources

These sources give the context for the findings. They are not interview results.

- **Scale of the problem.** Kazakhstan blocked about 85 million fraudulent phone calls in 2025 [1], and online fraud caused 11.2 billion tenge of damage in January–November 2025 [2]. This fits F1 but does not replace it: the interviews show the problem is felt by users.
- **Limits of number-based protection.** Rotating numbers and SIM cards registered under false identities weaken number blocking [3]. F2 shows two such failures at the user level.
- **Content-based detection.** Research shows that LLMs can detect scam intent from call content, including in real time [4], [5]. This supports F6 and F7, and the timeliness–recall trade-off reported in [5] relates to F10.
- **Kazakh–Russian code-switching.** Kazakh speech resources are limited and everyday Kazakh speech mixes with Russian [6], [7]. F12 shows that scammers use the same mixing.

## VI. Impact on Requirements

Each finding is traced to requirements in [06-requirements.md](06-requirements.md), Section IX. The main decisions are:

1. **Explanation of every assessment (F7, F4).** Reports show indicators with the supporting phrases and the warning gives a reason (FR-7, FR-10, FR-11).
2. **Two analysis modes (F8, F9).** Speakerphone and recording upload are both kept (FR-4, FR-5).
3. **Visible privacy guarantees (F11, F15).** Explicit consent, a deletion confirmation after every analysis, no stored audio, no contact or call-log access, and no caller numbers stored (FR-1, FR-3, FR-14, NFR-6, NFR-8, NFR-11).
4. **Speed (F10).** A latency target for live updates (NFR-1, preliminary, to be confirmed in VRT-10).
5. **Kazakh–Russian processing (F12).** Code-switched calls are supported and reported separately for each language (FR-13, MR-3).
6. **Conspicuous warning (F13, F4).** High-contrast warning with a one-sentence reason, tested with users (FR-8, NFR-12).
7. **Local processing (F15).** Not adopted, because Kazakh recognition and the models need server resources. This is compensated by the privacy guarantees above (decision D1 in the requirements).

## VII. Limitations

- **Sample size and selection.** Six participants chosen by convenience. Findings are indicative and not statistically representative.
- **Missing groups.** Five of six are university students and none is an older adult, although older adults and their relatives are a target group of the proposal. Assumption A2 is therefore untested.
- **Single interviewer.** Notes were taken by hand without audio recording, so wording is paraphrased.
- **Prototype not shown.** Participants reacted to the idea, not to the prototype ([../prototype/](../prototype/)). Usability is evaluated separately (NFR-12, NFR-13).
- **Next step.** Add at least one conversation with an older adult or a person who helps one, and show the prototype to the participants.

## References

[1] D. Pokidaev, "Kazakhstan blocked nearly 85 million fraudulent phone calls in 2025," *The Times of Central Asia*, Jan. 12, 2026. Accessed: Oct. 16, 2026. [Online]. Available: <https://timesca.com/kazakhstan-blocks-nearly-85-million-fraudulent-phone-calls-in-2025/>

[2] "«Рекордное количество». Сколько случаев мошенничества в сети зарегистрировали в Казахстане в 2025 году" ["A record number": How many cases of online fraud were registered in Kazakhstan in 2025], *Informburo.kz*, Dec. 31, 2025. Accessed: Oct. 16, 2026. [Online]. Available: <https://informburo.kz/novosti/rekordnoe-kolicestvo-skolko-slucaev-mosennicestva-v-seti-zaregistrirovali-v-kazaxstane-v-2025-godu> (in Russian)

[3] D. Pokidaev, "Kazakhstan to hold banks and mobile operators liable for online fraud losses," *The Times of Central Asia*, Jun. 24, 2025. Accessed: Oct. 16, 2026. [Online]. Available: <https://timesca.com/kazakhstan-to-hold-banks-and-mobile-operators-liable-for-online-fraud-losses/>

[4] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.

[5] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*.

[6] Y. Khassanov, S. Mussakhojayeva, A. Mirzakhmetov, A. Adiyev, M. Nurpeiissov, and H. A. Varol, "A crowdsourced open-source Kazakh speech corpus and initial speech recognition baseline," in *Proc. 16th Conf. Eur. Chapter Assoc. Comput. Linguistics (EACL)*, 2021, pp. 697–706, doi: 10.18653/v1/2021.eacl-main.58.

[7] S. Mussakhojayeva, Y. Khassanov, and H. A. Varol, "KSC2: An industrial-scale open-source Kazakh speech corpus," in *Proc. Interspeech*, 2022, pp. 1367–1371, doi: 10.21437/Interspeech.2022-421.