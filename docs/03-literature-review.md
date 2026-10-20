# Literature Review

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-4 Literature review
**Accessed:** Oct. 20, 2026

## I. Purpose and Method

This review establishes what is already known about detecting telephone fraud from conversation content, which approaches exist, and which of their limitations VeriTalk must take into account. It complements the existing system comparison [04-existing-systems.md](04-existing-systems.md), which covers commercial and operator products; this document covers research.

Sources were selected along the stages of the VeriTalk pipeline and the problems listed in the proposal (Section IX): (A) scam detection from call content, (B) the structure of scam conversations, (C) speech recognition for Kazakh, Russian and code-switched speech, including streaming, (D) text classification for Kazakh, and (E) explanations, warnings and privacy. Search was carried out in Google Scholar, the ACL Anthology, arXiv and publisher sites using combinations of "phone scam", "voice phishing", "vishing", "scam detection LLM", "Kazakh speech recognition", "code-switching", "Whisper streaming", "Kazakh text classification" and "phishing warning explanations".

Inclusion rules:

1. **Primary sources only.** Each source reports original research: a new method, dataset, experiment or user study. Surveys, systematic reviews, textbooks, vendor material and news are excluded.
2. **Last five years.** Published in October 2021 or later.
3. **Actually used.** The source informs a design or evaluation decision in VeriTalk.
4. **Traceable.** The source has a DOI or a stable link.

Sixteen sources were retained, all published in 2022–2026. Thirteen are peer-reviewed (journal articles and conference papers, including a student abstract and an extended abstract); three are arXiv preprints, used because they are the most recent work on their topic and no peer-reviewed equivalent was found.

## II. Analysis Table

**TABLE I. Reviewed sources**

| # | Source | Type | Approach | Key findings | Limitations | Relevance to VeriTalk |
|---|---|---|---|---|---|---|
| [1] | Shen et al., 2025 (AAAI) | Conference student abstract | Prompting LLMs to classify caller–victim transcripts as scam or not | LLMs can detect scam intent from conversation content | Authors report biased datasets, relatively low recall and hallucinations | Confirms content-based detection is feasible; motivates a baseline comparison and checks against hallucinated evidence |
| [2] | Shen et al., 2025 (CHI EA) | Conference extended abstract | Real-time LLM detection on incrementally growing transcripts, compared with retrospective analysis | Real-time recall 0.98–1.00; precision drops to 0.70–0.77 on synthetic data versus 0.95–1.00 retrospectively | Chinese and English only; trade-off between timeliness and precision | Directly informs the streaming mode (O4): early warnings cost false alarms, so the threshold must be tuned and reported |
| [3] | Wang et al., 2025 (ACM MM) | Conference paper | Pluggable sanitisation layer (PII masking, keyword/TF-IDF representations, summarisation) before LLM scam detection | Privacy can be traded off against accuracy per user; stronger sanitisation lowers detection quality | Chinese transcripts; assumes third-party LLM processing | Supports privacy-by-design; suggests masking personal data before any external model call |
| [4] | Ma et al., 2025 (ACM MM) | Conference paper | Audio–text dataset of 28,511 pairs (over 307 h) built from anonymised real calls, LLM self-instruction and multi-agent synthesis; fine-tuned audio LLM | Fine-tuned AntiFraud-Qwen2Audio reaches 83% average F1 versus 72.17% for GPT-4o | Chinese only; much of the data is synthetic | Shows synthetic augmentation is an accepted answer to data scarcity (O1), and that task-specific fine-tuning beats general LLMs |
| [5] | Boussougou and Park, 2023 (Mathematics) | Journal article | Attention-based 1D CNN–BiLSTM with FastText embeddings on Korean voice phishing transcripts (KorCCVi v2) | 99.32% accuracy, 99.31% F1 | Small, clean, single-language dataset; near-perfect scores suggest an easy test set; no explanation | Closest example of a supervised non-English vishing classifier; its scores show why a held-out, realistic test set is required |
| [6] | Kim et al., 2025 (Applied Sciences) | Journal article | KoBERT transcript classifier with attention-based interpretation, fused with an MFCC + CNN–BiLSTM synthetic-voice detector | High accuracy, precision, recall and F1 on validation data, robust on noisy real calls; attention reveals phishing-specific phrase patterns | Korean only; text and synthetic-voice signals mixed in one score | Supports a transformer text classifier with token-level evidence; confirms that synthetic voice detection is a separate problem, as excluded in the proposal scope |
| [7] | Sim and Kim, 2025 | arXiv preprint | Fine-tuning small open LLMs (Llama3-8B and others) for voice phishing detection, with expert evaluation criteria in the prompt and an adversarial test set | Fine-tuned Llama3-8B is the best small model and comparable to a GPT-4-based detector; expert criteria help more than chain-of-thought | Transcripts written by the authors; Korean only | Shows that a small self-hosted model can match a commercial LLM, and that an explicit indicator list improves detection |
| [8] | Wood et al., 2023 | arXiv preprint | Topic, time-series and emotion analysis of over 300 transcribed scam-baiting calls from YouTube | Scams follow scripted stages, each with its own social-engineering tactics | Scam-baiter calls are not real victim calls; English only | Basis for the indicator taxonomy and stage-aware scoring in streaming mode; a corpus source when real calls are unavailable |
| [9] | Radford et al., 2023 (ICML) | Conference paper | Whisper: encoder–decoder ASR trained on 680,000 h of weakly supervised multilingual audio | Robust zero-shot recognition across languages and conditions | Quality for low-resource languages such as Kazakh is much lower than for English; offline model | Chosen ASR model family (VRT-6); requires fine-tuning and per-language WER (O2) |
| [10] | Macháček et al., 2023 (IJCNLP-AACL demos) | Conference paper | Whisper-Streaming: local agreement policy over a sliding audio buffer | Turns offline Whisper into a real-time system with a latency of a few seconds | Latency and quality depend on hardware and chunk size; evaluated mainly on European languages | Direct design pattern for incremental transcription in streaming mode (O4) |
| [11] | Mussakhojayeva et al., 2022 (Interspeech) | Conference paper | KSC2: industrial-scale Kazakh corpus combining read and spontaneous sources | Over 1,000 h; contains Kazakh–Russian code-switching | Little conversational telephone audio | Main Kazakh fine-tuning set; evidence that code-switching is common and must be handled |
| [12] | Mussakhojayeva et al., 2023 (Information) | Journal article | 13 monolingual and 9 multilingual ASR models for ten Turkic languages | Best multilingual model cuts CER and WER by 56.7% and 54.3%; related Turkic languages help more than Russian or English | Read speech; no code-switching evaluation | Multilingual fine-tuning helps Kazakh, but Russian data alone will not fix Kazakh errors |
| [13] | Yeshpanov, 2026 (LREC) | Conference paper | Fine-tuning Whisper on 4.5 h of Kazakh songs plus Common Voice and FLEURS | Zero-shot Whisper WER on KSC2 is 81.2%; fine-tuning lowers it to 39.3% | Still worse than models trained on KSC2 itself | Quantifies how poorly off-the-shelf Whisper handles Kazakh, so fine-tuning on KSC2 is mandatory |
| [14] | Yeshpanov and Varol, 2024 (LREC-COLING) | Conference paper | KazSAnDRA: 180,064 Kazakh reviews; mBERT, XLM-R, RemBERT and mBART-50 fine-tuned for classification | Best model reaches F1 0.81 for binary polarity but 0.39 for five-class scores | Sentiment, not fraud; written reviews, not speech transcripts | Evidence that multilingual encoders including XLM-R (VRT-6) work for Kazakh binary classification, while fine-grained scales are much harder |
| [15] | Desolda et al., 2023 (IJHCS) | Journal article | Phishing warning dialogs that explain the most suspicious feature, compared with Chrome, Firefox and Edge warnings in a study with 150 participants | Most explanations were understood and showed potential to steer users away from malicious sites | Web phishing, not calls; remote survey rather than field use | Supports working assumption 2: a warning that names the concrete reason is understood better than a bare label |
| [16] | Cau et al., 2025 | arXiv preprint | Controlled experiment with 750 participants comparing expert-written and LLM-generated explanations in phishing warnings | LLM-generated explanations give protection comparable to expert-written ones; feature-based explanations help on real attacks, counterfactual ones reduce false positives | Email phishing; results differ between preprint versions | Supports generating the explanation text automatically, provided it is grounded in the detected indicators |

## III. Critical Review

### A. Approaches to Content-Based Scam Detection

Three families of approaches appear in recent work. **Supervised classifiers** [5], [6] learn from labelled transcripts and report very high scores, but on small Korean datasets; [5] gives no explanation, and its near-perfect results are more likely to reflect an easy test set than real-world performance. [6] adds attention-based interpretation, but attention weights are not guaranteed to reflect why the model decided, so they are weaker evidence than explicit indicators. **General-purpose LLMs** [1]–[3] need little task-specific data and can justify their output in natural language. However, Shen et al. report low recall and hallucination in the zero-shot setting [1], and a fall in precision when the model must decide before the call ends [2]. **Fine-tuned task-specific models** [4], [7] sit between the two: Ma et al. show that a fine-tuned audio model beats GPT-4o by about 11 F1 points [4], and Sim and Kim show that a fine-tuned 8B model matches a GPT-4-based detector, especially when the prompt lists expert evaluation criteria [7].

The sources agree that content carries enough signal to detect scams, and that task-specific training beats general models. They disagree on how reliable detection is in practice: the highest scores [5] come from the cleanest data, and the most realistic settings [2], [4] show clear losses in precision or F1. None reports results on realistic, imbalanced, multilingual data, and none covers Russian or Kazakh. This supports the proposal's decision to compare the trained model with a keyword-based baseline (O3) and to report precision and recall separately.

### B. What Is Known About Scam Conversations

Wood et al. [8] find that real scam calls follow scripted stages with stage-specific tactics, and Sim and Kim [7] show that encoding expert knowledge of scam techniques as explicit criteria improves detection more than generic reasoning. Together they justify representing fraud as a set of observable indicators (authority impersonation, urgency, requests for codes or transfers, secrecy) rather than as a single label. The staged structure in [8] also matters for streaming mode: early stages (greeting, authority claim) are weak evidence, and the decisive indicators often come later. This is consistent with the timeliness–precision trade-off reported in [2].

The data behind these findings is a recurring weakness. The transcripts in [7] were written by the authors, [8] uses scam-baiter recordings, and [4] relies largely on synthetic dialogues. No reviewed study uses real scam calls from Kazakhstan, so local relevance must come from the interviews planned in VRT-3.

### C. Speech Recognition for Kazakh and Code-Switching

All content-based detectors depend on transcripts, yet the detection studies [1]–[8] either start from text or work in Chinese, Korean or English, where ASR is mature. For Kazakh the picture is different. Open corpora exist [11], but they consist mostly of read or broadcast speech, not telephone conversations. Off-the-shelf Whisper [9] performs poorly on Kazakh (81.2% WER on KSC2 zero-shot), and fine-tuning lowers this substantially [13]. Multilingual training helps, but mainly with related Turkic languages; Russian data alone does not transfer well to Kazakh [12]. KSC2 documents frequent Kazakh–Russian code-switching [11], yet none of the reviewed works evaluates ASR specifically on code-switched conversational speech.

For streaming mode, Whisper-Streaming [10] shows that an offline model can produce a stable incremental transcript within a few seconds. Combined with [2], this means that VeriTalk's streaming latency is the sum of ASR delay and the time needed to collect enough indicators, and both should be reported.

### D. Text Classification for Kazakh

KazSAnDRA [14] is the only reviewed primary study that fine-tunes XLM-R and similar multilingual encoders on a large Kazakh dataset. Binary classification works reasonably well (F1 0.81), but performance drops sharply for a fine-grained five-class scale (F1 0.39). For VeriTalk this suggests detecting individual indicators as binary decisions and deriving the 0–100 risk score from them, rather than training a model to predict the score directly. A self-hosted encoder is also consistent with the finding in [4] and [7] that smaller fine-tuned models can match general LLMs, and with the privacy concern in [3]. Its drawback is the need for labelled data, which brings back the data scarcity problem addressed through synthetic augmentation in [4].

### E. Explanations, Warnings and Privacy

Most detection studies report only a label or score. LLM justifications [1] can be hallucinated, and attention-based interpretation [6] is not a reliable explanation of the decision. User studies on phishing warnings point the same way from the user's side: warnings that name the concrete suspicious feature are understood better than generic ones [15], and automatically generated explanations can protect users as well as expert-written ones when they are built on specific features [16]. This supports the proposal's working assumption 2 and the design in which each explanation is tied to a detected indicator and its transcript segment. Both studies concern web and email phishing, so the effect for phone calls still has to be confirmed in usability testing (O6).

On privacy, Wang et al. [3] are the only reviewed work that treats call content as sensitive data inside the detection pipeline. They show a measurable cost in accuracy when content is sanitised before analysis, which supports VeriTalk's choice to process audio on its own server and delete it after analysis rather than send transcripts to external services.

## IV. Research Gap and Implications for VeriTalk

**Gap.** Recent research demonstrates content-based scam detection in Chinese, Korean and English [1]–[8], and separately provides Kazakh speech and text resources [11]–[14]. No reviewed work combines them: there is no study of scam detection on Russian, Kazakh or code-switched calls, no evaluation of ASR errors propagating into scam detection, and no user study of explanations for phone-call warnings.

**Limitations the project takes into account:**

1. **Data scarcity and synthetic data** [4], [7], [8]: build a corpus with a Kazakh and mixed subset, use synthetic augmentation with a clearly separated real test set, and report results per language (O1, O3).
2. **Inflated scores on clean data** [5]: evaluate on held-out, realistic transcripts and against a keyword baseline (O3, O6).
3. **Timeliness versus precision** [2], [8]: report precision, recall and time-to-warning in streaming mode; avoid alerting on early-stage indicators alone (O4).
4. **Poor zero-shot Kazakh ASR** [9], [12], [13]: fine-tune Whisper on KSC2 and measure WER separately for Russian, Kazakh and code-switched audio (O2).
5. **Fine-grained scores are hard to learn** [14]: detect indicators as binary decisions and compute the risk score from them (O3).
6. **Unreliable explanations** [1], [6], [15], [16]: tie every explanation to a detected indicator and transcript segment, and test comprehension with users (O3, O5, O6).
7. **Privacy** [3]: no audio retention and no external model calls with raw transcripts.

## V. Limitations of This Review

- Three sources [7], [8], [16] are preprints and have not been peer-reviewed. [7] is reported by its authors as under revision at a journal.
- Restricting the review to primary sources from the last five years excludes earlier foundational work, such as the original multilingual encoder and scam psychology studies. Where they matter, their effect is covered through recent studies that build on them (for example [14] for XLM-R).
- No peer-reviewed study on phone-scam detection in Russian or Kazakh was found. This supports the gap but may also reflect publications in local journals not indexed by the search tools used.
- Detection results in [2], [4], [5], [7] are reported on different datasets and metrics and cannot be compared numerically.
- Exact metric values for [6] and [7] were not available in the abstracts and are described qualitatively.

## References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand? (Student abstract)," in *Proc. AAAI Conf. Artif. Intell.*, 2025, pp. 29487–29489. [Online]. Available: <https://ojs.aaai.org/index.php/AAAI/article/view/35298>

[2] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," in *Extended Abstracts CHI Conf. Human Factors Comput. Syst. (CHI EA)*, 2025, doi: 10.1145/3706599.3720263.

[3] K. Wang, Z. Shen, Y. Zhang, M. M. K. Cheung, X. Luo, G. Ngai, and E. Y. Fu, "One size fits all? A modular adaptive sanitization kit (MASK) for customizable privacy-preserving phone scam detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 12381–12389, doi: 10.1145/3746027.3758164.

[4] Z. Ma *et al.*, "TeleAntiFraud-28k: An audio-text slow-thinking dataset for telecom fraud detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 5853–5862, doi: 10.1145/3746027.3755835.

[5] M. K. Moussavou Boussougou and D.-J. Park, "Attention-based 1D CNN-BiLSTM hybrid model enhanced with FastText word embedding for Korean voice phishing detection," *Mathematics*, vol. 11, no. 14, Art. no. 3217, 2023, doi: 10.3390/math11143217.

[6] J. Kim, S. Gu, Y. Kim, S. Lee, and C. Kang, "A multimodal voice phishing detection system integrating text and audio analysis," *Appl. Sci.*, vol. 15, no. 20, Art. no. 11170, 2025, doi: 10.3390/app152011170.

[7] J. Y. Sim and S. H. Kim, "Detecting voice phishing with precision: Fine-tuning small language models," 2025, *arXiv:2506.06180*. [Online]. Available: <https://arxiv.org/abs/2506.06180>

[8] I. D. Wood, M. Kepkowski, L. Zinatullin, T. Darnley, and M. A. Kaafar, "An analysis of scam baiting calls: Identifying and extracting scam stages and scripts," 2023, *arXiv:2307.01965*. [Online]. Available: <https://arxiv.org/abs/2307.01965>

[9] A. Radford, J. W. Kim, T. Xu, G. Brockman, C. McLeavey, and I. Sutskever, "Robust speech recognition via large-scale weak supervision," in *Proc. 40th Int. Conf. Mach. Learn. (ICML)*, PMLR vol. 202, 2023, pp. 28492–28518. [Online]. Available: <https://proceedings.mlr.press/v202/radford23a.html>

[10] D. Macháček, R. Dabre, and O. Bojar, "Turning Whisper into real-time transcription system," in *Proc. 13th Int. Joint Conf. Natural Lang. Process. and 3rd Conf. Asia-Pacific Chapter ACL: System Demonstrations*, 2023, pp. 17–24. [Online]. Available: <https://aclanthology.org/2023.ijcnlp-demo.3>

[11] S. Mussakhojayeva, Y. Khassanov, and H. A. Varol, "KSC2: An industrial-scale open-source Kazakh speech corpus," in *Proc. Interspeech*, 2022, pp. 1367–1371, doi: 10.21437/Interspeech.2022-421.

[12] S. Mussakhojayeva, K. Dauletbek, R. Yeshpanov, and H. A. Varol, "Multilingual speech recognition for Turkic languages," *Information*, vol. 14, no. 2, Art. no. 74, 2023, doi: 10.3390/info14020074.

[13] R. Yeshpanov, "Using songs to improve Kazakh automatic speech recognition," in *Proc. 15th Lang. Resources Eval. Conf. (LREC)*, 2026, pp. 5528–5537. [Online]. Available: <https://aclanthology.org/2026.lrec-1.431/>

[14] R. Yeshpanov and H. A. Varol, "KazSAnDRA: Kazakh sentiment analysis dataset of reviews and attitudes," in *Proc. Joint Int. Conf. Comput. Linguistics, Lang. Resources Eval. (LREC-COLING)*, 2024, pp. 9657–9667. [Online]. Available: <https://aclanthology.org/2024.lrec-main.844>

[15] G. Desolda, J. Aneke, C. Ardito, R. Lanzilotti, and M. F. Costabile, "Explanations in warning dialogs to help users defend against phishing attacks," *Int. J. Human-Comput. Stud.*, vol. 176, Art. no. 103056, 2023, doi: 10.1016/j.ijhcs.2023.103056.

[16] F. M. Cau, G. Desolda, F. Greco, L. D. Spano, and L. Viganò, "Can large language models automate phishing warning explanations? A controlled experiment on effectiveness and user perception," 2025, *arXiv:2507.07916*. [Online]. Available: <https://arxiv.org/abs/2507.07916>
