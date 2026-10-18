# Project Proposal

## I. Project Title

**Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence**

Working name: **VeriTalk**

## II. Project Team and Supervision

The project is carried out by students of group SE-2410, Astana IT University. Responsibilities are distributed by technical area, as shown in Table I.

**TABLE I. Team Members and Responsibilities**

| Member | Area | Responsibilities |
| --- | --- | --- |
| Nikita Vasilenko (Василенко Никита Александрович) | Backend | Speech recognition pipeline, server API, streaming analysis mode |
| Danial Seit (Сеит Даниал Қайратұлы) | Frontend | Mobile client, user experience design and prototyping, usability testing; project management |
| Abilkaiyr Ozbekbay (Өзбекбай Әбілқайыр Мұхамедұлы) | Machine learning | Dataset collection and annotation, risk model development and evaluation |

**Supervisor:** Azamat Serek, PhD, Associate Professor, School of Software Engineering, Astana IT University.

## III. Background and Problem Statement

### A. Context

Telephone fraud based on social engineering is a persistent and growing threat in Kazakhstan. Damage from online fraud in January–November 2025 amounted to 11.2 billion tenge, 96.7% of which was incurred by individuals [1]. In the same year, law enforcement agencies blocked approximately 85 million fraudulent phone calls [2], and telephone scams accounted for 22% of the common fraud schemes recorded by the anti-fraud centre of the National Bank [3]. The scale of the problem has prompted regulatory action: the state is introducing joint liability of banks and mobile operators for fraud cases involving their infrastructure [3].

A typical scam call follows a recognisable social engineering script. The caller impersonates a trusted authority (a bank security officer, a police investigator or a government official), creates a sense of urgency or threat, and guides the victim towards a harmful action: disclosing a one-time SMS code or card details, transferring funds to a so-called "safe account", taking out a loan, or installing remote-access software.

### B. Limitations of Current Countermeasures

Current countermeasures operate predominantly at the level of call metadata: caller number reputation, spam databases and operator-side blocking. Such measures are inherently reactive, since a number must first be identified as fraudulent before it can be blocked, and they are circumvented by rotating numbers, including through SIM cards registered under false identities, of which nearly 100,000 cases had been detected in 2025 by late June [3]. Metadata-based measures provide no information about the content of the conversation itself, which is where the fraudulent intent is actually expressed.

Recent studies have shown that fraudulent intent can be detected from the content of the caller–target exchange using large language models, including in real time [4], [5]. The same studies identify unresolved limitations: imbalanced datasets, modest recall and model hallucination [4], as well as a trade-off between detection timeliness and recall [5]. Moreover, this line of research has not, to the team's knowledge, been applied to Russian- and Kazakh-language calls; this will be examined in the literature review and the existing system comparison. The Kazakh language poses additional difficulties: large open-source Kazakh speech corpora have become available only recently [6], [7], and everyday Kazakh speech frequently involves Kazakh–Russian code-switching [7], which a speech recognition and classification pipeline must accommodate.

### C. Problem Statement

Mobile phone users in Kazakhstan lack a means of assessing, on the basis of conversation content, whether an ongoing or completed phone call constitutes a fraud attempt. Existing number-based protection does not analyse what is said during the call, and content-based detection approaches reported in the literature have not been adapted to the Russian–Kazakh bilingual setting or made available to end users in an explainable form.

### D. Working Assumptions

The following assumptions underpin the proposed solution but have not yet been verified. They will be tested through interviews with prospective users and reported in the evidence of relevance document:

1. Users are willing to have a call analysed provided that the audio is not retained.
2. A warning accompanied by specific evidence (e.g., "the caller requested an SMS code") is perceived as more credible and actionable than an unexplained risk label.
3. Users are willing to place a call on speakerphone, or to upload a recording, in order to obtain an assessment.

## IV. Target Users

The primary users are individual mobile phone users in Kazakhstan who receive calls in Russian or Kazakh, with particular attention to groups at elevated risk of social engineering, such as older adults and users with limited digital literacy. Secondary stakeholders include family members who assist vulnerable users in assessing suspicious calls and, prospectively, anti-fraud units of banks and mobile operators, for which the risk assessment model could serve as a component of their own systems.

## V. Aim

The aim of the project is to develop a mobile application with a server-side artificial intelligence component that assesses the fraud risk of a phone conversation on the basis of its content and provides the user with an explanation of the assessment.

## VI. Objectives

The objectives and their completion criteria are listed in Table II. The numerical thresholds are preliminary and will be finalised in the verification and evaluation plan.

**TABLE II. Project Objectives and Completion Criteria**

| # | Objective | Completion criterion |
| --- | --- | --- |
| O1 | Construct an annotated corpus of fraudulent and legitimate phone conversations in Russian and Kazakh, together with a documented taxonomy of fraud indicators | The corpus contains at least 300 annotated transcripts, of which at least 100 are in Kazakh or mixed Kazakh–Russian; every conversation and indicator is annotated according to the documented taxonomy |
| O2 | Implement a speech recognition pipeline for Russian and Kazakh call audio | Recordings in both languages are transcribed automatically; word error rate is measured on a held-out test set and reported separately for each language |
| O3 | Develop a risk assessment model that produces a risk score (0–100), the detected fraud indicators and the transcript segments supporting each indicator | On a held-out test set, the model achieves a higher F1 score than a keyword-based baseline, reported separately for Russian and Kazakh |
| O4 | Implement a server API supporting two modes: analysis of a complete recording and near real-time analysis of a conversation streamed in segments | Both modes operate end-to-end; in streaming mode, the risk score is updated within the latency threshold specified in the evaluation plan |
| O5 | Develop a mobile application for submitting recordings, conducting live analysis via speakerphone, and viewing explained risk reports | All three scenarios can be completed on a physical device |
| O6 | Evaluate the system against the baseline and with prospective users | An evaluation report presents precision, recall, F1 score and latency in comparison with the baseline, together with the results of usability testing with at least five participants |

## VII. Expected Outcomes

The project is expected to deliver the following:

1. A functional prototype comprising a mobile application and a server supporting recording-based and streaming analysis.
2. An annotated corpus of Russian and Kazakh phone conversations and a documented taxonomy of fraud indicators.
3. A trained risk assessment model and a rule-based baseline for comparative evaluation.
4. An evaluation report covering classification quality, latency and usability.
5. Technical documentation, including requirements specification, architectural description, diagrams and a user guide.

## VIII. Scope

### A. Inclusions

The project covers the analysis of uploaded call recordings and the near real-time analysis of calls conducted on speakerphone, captured through the device microphone. Recordings may originate, for example, from the pre-installed dialer of the device, which is not subject to the restrictions imposed on third-party applications [8], [9]. Both Russian and Kazakh are supported, including conversations with code-switching between the two languages.

Risk assessment is limited to fraud and social engineering, characterised by indicators such as authority impersonation, urgency and threats, requests for one-time codes or payment card data, instructions to transfer funds or take out loans, requests to install remote-access software, and demands for secrecy. Each assessment comprises a risk score, the detected indicators and the supporting transcript segments. The system follows a privacy-by-design approach: audio is deleted upon completion of the analysis, and only the resulting report is retained, subject to user consent.

### B. Exclusions

The following are excluded from the scope of the project:

1. **Direct capture of call audio from the telephony stack.** On Android, voice call audio can be captured only by privileged pre-installed applications [8], and Google Play prohibits the use of the Accessibility API by third-party applications for call recording [9]. This capability is therefore available only to device manufacturers and mobile operators.
2. **Automatic blocking or termination of calls.** The system informs the user and leaves the decision to them.
3. **Detection of synthetic (cloned) voices.** This constitutes a distinct research problem and may be considered as an extension if time permits.
4. **Integration with banking or mobile operator systems.**
5. **Number-based spam detection**, which is already provided by existing applications.
6. **Languages other than Russian and Kazakh.**

## IX. Engineering Complexity

The engineering complexity of the project arises from the integration of several technically demanding components:

1. **A multi-stage AI pipeline.** Audio is processed through speech recognition, fraud indicator detection, risk scoring and explanation generation. Recognition errors propagate to subsequent stages, so their effect on classification quality must be measured and mitigated.
2. **Machine learning under data scarcity.** Annotated scam call data in Russian and Kazakh is not publicly available to the team's knowledge, so the corpus must be collected, annotated and potentially augmented with synthetic data, and the model must be evaluated rigorously against a baseline.
3. **Bilingual processing with a low-resource language.** Kazakh has substantially fewer speech and text resources than Russian [6], [7], and code-switching within a single conversation [7] must be handled by both the recognition and the classification stages.
4. **Near real-time streaming.** The streaming mode requires audio segmentation, incremental transcription and continuous re-scoring within a defined latency budget.
5. **Explainability.** The system must justify each assessment by reference to specific indicators and transcript evidence rather than present an opaque score.
6. **Privacy and security.** Phone conversations constitute highly sensitive personal data, which constrains where processing takes place, what is stored and for how long.
7. **Distributed architecture.** The mobile client, the server API and the machine learning components must be integrated, deployed and tested as a single system.

## References

[1] "«Рекордное количество». Сколько случаев мошенничества в сети зарегистрировали в Казахстане в 2025 году" ["A record number": How many cases of online fraud were registered in Kazakhstan in 2025], _Informburo.kz_, Dec. 31, 2025. Accessed: Oct. 16, 2026. [Online]. Available: <https://informburo.kz/novosti/rekordnoe-kolicestvo-skolko-slucaev-mosennicestva-v-seti-zaregistrirovali-v-kazaxstane-v-2025-godu> (in Russian)

[2] D. Pokidaev, "Kazakhstan blocked nearly 85 million fraudulent phone calls in 2025," _The Times of Central Asia_, Jan. 12, 2026. Accessed: Oct. 16, 2026. [Online]. Available: <https://timesca.com/kazakhstan-blocks-nearly-85-million-fraudulent-phone-calls-in-2025/>

[3] D. Pokidaev, "Kazakhstan to hold banks and mobile operators liable for online fraud losses," _The Times of Central Asia_, Jun. 24, 2025. Accessed: Oct. 16, 2026. [Online]. Available: <https://timesca.com/kazakhstan-to-hold-banks-and-mobile-operators-liable-for-online-fraud-losses/>

[4] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, _arXiv:2409.11643_.

[5] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, _arXiv:2502.03964_.

[6] Y. Khassanov, S. Mussakhojayeva, A. Mirzakhmetov, A. Adiyev, M. Nurpeiissov, and H. A. Varol, "A crowdsourced open-source Kazakh speech corpus and initial speech recognition baseline," in _Proc. 16th Conf. Eur. Chapter Assoc. Comput. Linguistics (EACL)_, 2021, pp. 697–706, doi: 10.18653/v1/2021.eacl-main.58.

[7] S. Mussakhojayeva, Y. Khassanov, and H. A. Varol, "KSC2: An industrial-scale open-source Kazakh speech corpus," in _Proc. Interspeech_, 2022, pp. 1367–1371, doi: 10.21437/Interspeech.2022-421.

[8] Android Developers, "Sharing audio input." Accessed: Oct. 16, 2026. [Online]. Available: <https://developer.android.com/media/platform/sharing-audio-input>

[9] S. Dent, "Google is banning third-party call recording apps from the Play Store," _Engadget_, Apr. 22, 2022. Accessed: Oct. 16, 2026. [Online]. Available: <https://www.engadget.com/google-is-banning-third-party-call-recording-apps-from-the-play-store-093201443.html>
