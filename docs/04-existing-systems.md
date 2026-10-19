# Existing System Comparison

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-5 Existing system comparison
**Accessed:** Oct. 19, 2026

## I. Purpose and Method

This document compares existing solutions that protect users from telephone fraud and identifies the gap that VeriTalk addresses. Candidates were selected using three rules: (a) the system targets phone-call fraud or closely related social-engineering scams, (b) it is publicly documented, and (c) it is relevant to Kazakhstan, either directly or as the closest available technical analogue. Evidence comes from vendor documentation, press releases and news reports; no system was trialled hands-on, and several sources are vendor claims rather than independent evaluations (see Section V).

Five systems were selected:

1. **Google Scam Detection** (Phone by Google, Pixel).
2. **Truecaller** (AI Call Scanner and Assistant).
3. **MTS "Safe Call" and SberMobile "Aura"** (Russian operator-side AI warnings).
4. **Kazakhtelecom / Kcell anti-fraud** (Kazakhstan network-level protection).
5. **Norton Genie Scam Protection** (user-initiated AI scam analysis).

Academic LLM-based detectors [15], [16] are discussed separately as the research baseline, since they are not end-user products.

## II. System Descriptions

### A. Google Scam Detection

Scam Detection in the Phone by Google app listens for conversation patterns commonly associated with scams, then alerts the user with an audio and haptic cue and a visual "Likely scam" warning with an option to end the call [2]. Processing is on-device: Gemini Nano on Pixel 9 and newer, smaller on-device models on Pixel 6–8a [1]. Google states that no audio or transcript is stored or sent off the device [2]. The feature is off by default and applies only to calls from unknown numbers [1]. At launch it supported English in the U.S. [2]; the India rollout in November 2025 is limited to Pixel 9+ and English [3].

### B. Truecaller

Truecaller's core product is caller identification and spam labelling. Its AI Call Scanner distinguishes human voices from AI-synthesised voices; it is part of the Premium plan and was launched for Android in the U.S. [4]. The company stated that the model works only with English audio [5]. Truecaller Assistant answers calls on the user's behalf and shows a live transcript of the caller; in India it supports English, Hindi and Hinglish [6]. Neither feature assesses the semantic content of a call for fraud indicators.

### C. MTS "Safe Call" and SberMobile "Aura" (Russia)

MTS "Safe Call" uses AI to analyse the conversation for signs of fraud and plays a voice warning audible only to the subscriber; MTS states that most fraudsters are identified within the first minute, and the service is enabled through the "Zashchitnik" service in the My MTS app [7]. SberMobile's "Aura" analyses the voice stream for a behavioural model of fraud and plays a warning the caller cannot hear; the pilot reported 80% accuracy with under 1% false positives, ran in 12 regions, and was not offered to other operators [8], [9]. Operator statements about methods are inconsistent: another Russian operator states that its neural network analyses the sound wave rather than the conversation content [17].

### D. Kazakhtelecom / Kcell anti-fraud (Kazakhstan)

Kazakhtelecom reports software that detects fraudulent calls by signatures, intercepting about 6% of such calls, and says it is developing AI models to scale this work in coordination with the Prosecutor General's Office and the National Bank's anti-fraud centre [10]. Kcell has redirected suspicious calls to the Kazakhtelecom anti-fraud call centre, where agents keep the fraudster on the line [11]. National anti-fraud systems are described as analysing behavioural anomalies and technical connection parameters, with more than 77 million calls blocked [12]. All of this operates in the network, with no user-facing explanation.

### E. Norton Genie Scam Protection

Norton's Safe SMS analyses the meaning of words in text messages, while Safe Call blocks or labels incoming calls (a number-reputation function) [13]. Genie's deepfake detection currently covers English-language YouTube video links [14]. It shows that user-initiated AI scam analysis exists, but it is not applied to call content.

### F. Research baseline

Shen et al. show that LLMs can detect scam intent from call transcripts, including in real time, but report imbalanced data, modest recall, hallucination [15] and a trade-off between timeliness and recall [16]. Neither study addresses Russian or Kazakh.

## III. Comparison Matrix

Legend: ✔ supported, ◐ partial, ✘ not supported, ? not found in sources, n/a not applicable.

**TABLE I. Comparison of existing systems and VeriTalk**

| # | Criterion | Google Scam Detection [1]–[3] | Truecaller [4]–[6] | MTS / Sber Aura [7]–[9] | Kazakhtelecom / Kcell [10]–[12] | Norton Genie [13], [14] | VeriTalk (planned) |
|---|---|---|---|---|---|---|---|
| C1 | Analyses conversation content | ✔ | ✘ (number reputation, AI-voice detection) | ✔ (claimed) | ✘ (signatures, metadata) | ◐ (SMS text only) | ✔ |
| C2 | Operating mode | Real time | During call (scanner), call screening | Real time | Before connection, in network | User-initiated | Real time + uploaded recording |
| C3 | Platform / access | Pixel only (6+ beta, 9+ Gemini Nano) | Android/iOS app, Premium for scanner | Subscribers of MTS / SberMobile only | Operator side, no app | Norton 360 mobile app | Mobile app (any device) |
| C4 | Russian support | ✘ | ? | ✔ | n/a | ? | ✔ |
| C5 | Kazakh and code-switching | ✘ | ? | ✘ | n/a | ? | ✔ |
| C6 | Explainability (indicators + evidence) | ◐ (warning label, no breakdown documented) | ✘ | ✘ (voice warning) | ✘ | ◐ (general guidance) | ✔ |
| C7 | Privacy / data handling | ✔ on-device, nothing stored | ◐ scanner analyses recorded call audio | ◐ processed by operator | n/a | ? | ✔ audio deleted after analysis |
| C8 | Cost model | Phone app feature, no separate fee stated | Premium subscription | Operator service | No user action | Subscription | Not yet defined |
| C9 | Main limitation | English only, Pixel only | Does not assess what is said | Operator lock-in, closed model, no Kazakh | Cannot see call content | Call protection is number-based | Small data, prototype stage |

## IV. Gap Analysis

1. **Language gap.** No reviewed system documents support for Kazakh or Kazakh–Russian code-switching. Russian content analysis exists only inside closed operator services [7]–[9].
2. **Access gap.** Content-based analysis is tied to a specific phone (Pixel) or operator (MTS, SberMobile). A Kazakhstani user on an arbitrary Android or iOS phone and operator has no equivalent.
3. **Explainability gap.** None of the reviewed systems documents showing which fraud indicators were detected and which parts of the conversation support them. Users receive a label or a voice warning only. This directly relates to working assumption 2 of the proposal.
4. **Interaction gap.** Existing systems work inside the call. Assessing an already recorded call, which helps users and relatives review suspicious conversations, is not offered.
5. **Complementarity with local anti-fraud.** Kazakhstan's network-level protection [10]–[12] blocks known patterns before the call reaches the user and does not see content. VeriTalk addresses what gets through, so the two are complementary rather than competing.

Fewer than three systems perform content-based call analysis (Google, MTS/Sber), but five relevant systems were reviewed, so the comparison requirement is met.

**Conclusion.** VeriTalk is justified by the combination of (i) Russian and Kazakh support including code-switching, (ii) operator- and device-independent access, (iii) evidence-based explanations, and (iv) both live and recording-based analysis. Individually, some of these exist elsewhere; their combination for the Kazakhstani setting does not appear in the reviewed sources.

## V. Limitations of This Comparison

- Most evidence is press releases and news from 2024–2026; independent performance evaluations were not found. The 80% accuracy of Aura [8] is a 2021 pilot figure.
- "?" entries mean the information was not found, not that the feature is absent. Truecaller and Norton availability and language support in Kazakhstan should be verified.
- Google's language support may have expanded since the cited sources; re-check before submission.
- MTS pricing and Samsung's equivalent features were not examined.

## References

[1] "New AI-powered scam detection features to help protect you on Android," *Google Blog*. Accessed: Oct. 19, 2026. [Online]. Available: <https://blog.google/security/new-ai-powered-scam-detection-features/>

[2] "Live Scam Detection in calls rolling out to Pixel 6-9 Phone app," *9to5Google*, Nov. 13, 2024. Accessed: Oct. 19, 2026. [Online]. Available: <https://9to5google.com/2024/11/13/pixel-phone-scam-detection/>

[3] N. Lacsina, "Google ramps up AI scam protection in India," *Gulf News*, Nov. 2025. Accessed: Oct. 19, 2026. [Online]. Available: <https://gulfnews.com/technology/media/google-ramps-up-ai-scam-protection-in-india-1.500355149>

[4] "TrueCaller launches AI Call Scanner," *Speech Technology Magazine*. Accessed: Oct. 19, 2026. [Online]. Available: <https://www.speechtechmag.com/Articles/News/Speech-Technology-News/TrueCaller-Launches-AI-Call-Scanner-164270.aspx>

[5] "Video interview: Truecaller AI Voice Scanner," *MediaNama*, Jun. 2024. Accessed: Oct. 19, 2026. [Online]. Available: <https://www.medianama.com/2024/06/223-video-interview-truecaller-ai-voice-scanner/>

[6] "Truecaller Assistant launches in India for Android users," *GSMArena*. Accessed: Oct. 19, 2026. [Online]. Available: <https://m.gsmarena.com/truecaller_assistant_india_launch_price_details-news-59245.php>

[7] "МТС начала предупреждать о телефонном мошенничестве во время разговора" [MTS starts warning about phone fraud during a conversation], *Mobile-review.com*. Accessed: Oct. 19, 2026. [Online]. Available: <https://mobile-review.com/all/?p=159342> (in Russian)

[8] "«Сбер» разработал нейросеть, распознающую звонки от мошенников. Точность — 80%" [Sber developed a neural network that recognises scam calls. Accuracy: 80%], *Rozetked*. Accessed: Oct. 19, 2026. [Online]. Available: <https://rozetked.me/news/19428-cber-razrabotal-neyroset-raspoznayuschuyu-zvonki-ot-moshennikov-tochnost-80> (in Russian)

[9] "ИИ защитит клиентов Сбербанка от мошенничества" [AI will protect Sberbank clients from fraud], *SecurityLab*. Accessed: Oct. 19, 2026. [Online]. Available: <https://www.securitylab.ru/news/525126.php> (in Russian)

[10] B. Musin, ""Казахтелеком" сообщил о мерах против телефонных мошенников" [Kazakhtelecom reported measures against phone fraudsters], *BES.media*. Accessed: Oct. 19, 2026. [Online]. Available: <https://bes.media/news/kazahtelekom-soobshil-o-merah-protiv-telefonnih-moshennikov/> (in Russian)

[11] "Kcell перенаправил в антифрод-кол-центр более 30 тысяч подозрительных звонков" [Kcell redirected over 30,000 suspicious calls to the anti-fraud call centre], *Informburo.kz*, 2026. Accessed: Oct. 19, 2026. [Online]. Available: <https://informburo.kz/novosti/kcell-perenapravil-v-antifrod-kol-centr-bolee-30-tysiac-podozritelnyx-zvonkov> (in Russian)

[12] "Казахстанцам рассказали, как перехватывают звонки от мошенников" [Kazakhstanis told how scam calls are intercepted], *Digital Business*, Jan. 26, 2026. Accessed: Oct. 19, 2026. [Online]. Available: <https://digitalbusiness.kz/2026-01-26/kazahstantsam-rasskazali-kak-perehvativayut-zvonki-ot-moshennikov/amp/> (in Russian)

[13] "Norton's AI-powered features defend against scams and social engineering threats," *Help Net Security*. Accessed: Oct. 19, 2026. [Online]. Available: <https://www.helpnetsecurity.com/?p=323793>

[14] "Norton adds audio and visual deepfake protection on mobile," *Gen Newsroom*, Jul. 31, 2025. Accessed: Oct. 19, 2026. [Online]. Available: <https://newsroom.gendigital.com/2025-07-31-Norton-Adds-Audio-and-Visual-Deepfake-Protection-on-Mobile>

[15] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.

[16] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*.

[17] "Мошенники не перезвонят: как операторы ломают их схемы" [Scammers will not call back: how operators break their schemes], *Habr / Kommersant*. Accessed: Oct. 19, 2026. [Online]. Available: <https://habr.com/ru/articles/841320> (in Russian)
