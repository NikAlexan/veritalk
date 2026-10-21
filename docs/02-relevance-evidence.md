# Evidence of the Relevance

## I. Overview
To ensure the VeriTalk application addresses real user needs and to inform the requirements specification, the team conducted semi-structured interviews with 6 target users between October 18 and 20, 2026. All participants are university students, representing a demographic that is technically literate, actively receives calls from unknown numbers, and frequently assists older relatives with digital security.

This document synthesizes the findings, distinguishes verified user statements from the team's working assumptions, and corroborates these findings with external literature. The interview notes are available in `docs/evidence/interview-notes.md`.

## II. Findings and Requirements Analysis

### A. Current Processes and Pain Points
* **[Verified]** Users encounter social engineering scam calls frequently. This aligns with national statistics reporting that 85 million fraudulent calls were blocked in Kazakhstan in 2025 [1] and over 11.2 billion tenge was lost to online fraud [2].
* **[Verified]** Existing Caller ID systems (e.g., Truecaller) are failing to detect zero-day spoofed local numbers. This confirms the systemic limitation of metadata-based protection, especially given the rapid proliferation of SIM cards registered under false identities [3].
* **[Verified]** Ignoring all unknown numbers is not a viable strategy, as it leads to missed legitimate calls (e.g., couriers, job interviews).
* **[Assumption]** Users believe they can easily spot a scammer on their own. *(Correction based on interviews: Even tech-savvy students admit that stress, urgency, or the caller knowing personal data creates enough psychological pressure to cause doubt).*

### B. Validation of the Proposed Solution (VeriTalk)
* **[Verified]** There is strong interest in a tool that analyzes the *content* (semantics) of the conversation rather than just the phone number. Academic studies confirm that analyzing the caller-target exchange via LLMs in real-time is a viable and necessary evolution in fraud detection [4], [5].
* **[Verified]** Users highly value explainability. They do not just want a "Spam Risk" label; they want to see specific triggers (e.g., highlighting that the caller asked for an SMS code).
* **[Assumption]** Users will find it inconvenient to put the application on speakerphone during a call. *(Correction based on interviews: Users are highly willing to put suspicious calls on speakerphone, especially in private environments or when helping relatives navigate a call).*
* **[Verified]** Scam calls frequently involve bilingual (Russian/Kazakh) dialogue to build trust. This reinforces the need for a robust bilingual speech recognition pipeline that can handle code-switching, a recognized challenge in Kazakh speech processing [6], [7].

### C. Privacy and Security Concerns
* **[Verified]** Privacy is a major barrier to adoption. IT-savvy users are highly suspicious of apps that require contact book access or store audio in the cloud.
* **[Verified]** Providing an option to upload an offline audio recording (post-call analysis) is heavily requested as a privacy-preserving alternative to real-time microphone streaming.
* **[Assumption]** A standard privacy policy is sufficient to gain user trust. *(Correction: Users explicitly stated they want architectural guarantees—such as a clear UI confirmation that audio files are deleted immediately after processing).*

## III. Impact on System Requirements
Based on the evidence gathered from these interviews and supported by the literature, the following critical decisions will directly shape the Requirements Specification:
1. **Explainability Requirement:** The UI must display the specific detected fraud indicators (e.g., urgency, data requests) and suspicious phrases alongside the risk score [5].
2. **Dual-Mode Operation:** The system must support both real-time speakerphone analysis and local file-upload analysis to accommodate varying privacy preferences.
3. **Zero-Retention Architecture:** The backend must guarantee that audio streams and uploaded files are deleted immediately after the risk score is generated.
4. **Bilingual Support Validation:** The AI model must seamlessly handle conversations that switch between Kazakh and Russian [7], as this is a confirmed social engineering tactic.

## IV. References
[1] D. Pokidaev, "Kazakhstan blocked nearly 85 million fraudulent phone calls in 2025," *The Times of Central Asia*, Jan. 12, 2026. 
[2] "«Рекордное количество». Сколько случаев мошенничества в сети зарегистрировали в Казахстане в 2025 году," *Informburo.kz*, Dec. 31, 2025. 
[3] D. Pokidaev, "Kazakhstan to hold banks and mobile operators liable for online fraud losses," *The Times of Central Asia*, Jun. 24, 2025. 
[4] Z. Shen et al., "Combating phone scams with LLM-based detection: Where do we stand?" 2024, *arXiv:2409.11643*.
[5] Z. Shen et al., "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*.
[6] Y. Khassanov et al., "A crowdsourced open-source Kazakh speech corpus and initial speech recognition baseline," in *Proc. 16th Conf. Eur. Chapter Assoc. Comput. Linguistics (EACL)*, 2021, pp. 697–706.
[7] S. Mussakhojayeva, Y. Khassanov, and H. A. Varol, "KSC2: An industrial-scale open-source Kazakh speech corpus," in *Proc. Interspeech*, 2022, pp. 1367–1371.