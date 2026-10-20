# Literature Review

**Project:** VeriTalk. Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-4 Literature review
**Accessed:** Oct. 20, 2026

## I. Purpose and method

This review covers research on detecting telephone fraud from what callers say, and the limitations of that research that VeriTalk has to plan for. Commercial and operator products are compared separately in [04-existing-systems.md](04-existing-systems.md).

We picked sources for each stage of the VeriTalk pipeline and for the problems listed in Section IX of the proposal: (A) scam detection from call content, (B) the structure of scam conversations, (C) speech recognition for Kazakh, Russian and code-switched speech, including streaming, (D) text classification for Kazakh, and (E) explanations, warnings and privacy. We searched Google Scholar, the ACL Anthology, arXiv and publisher sites for combinations of "phone scam", "voice phishing", "vishing", "scam detection LLM", "Kazakh speech recognition", "code-switching", "Whisper streaming", "Kazakh text classification" and "phishing warning explanations".

A source had to meet five rules:

1. It reports original research: a new method, dataset, experiment or user study. Surveys, systematic reviews, textbooks, vendor material and news do not qualify.
2. It was published in October 2021 or later.
3. It informs a design or evaluation decision in VeriTalk.
4. It has a DOI or a stable link.
5. Its full text is free to read, at the publisher or on arXiv. The publishers here are MDPI, the ACL Anthology, the ISCA Archive, PMLR, AAAI and the ACM Digital Library, which has been open access since January 2026.

Sixteen sources passed, all from 2022 to 2026. Twelve are peer-reviewed journal articles and conference papers, including a student abstract and an extended abstract. Four are arXiv preprints; we kept them because they are the newest work on their topic and have no peer-reviewed equivalent.

## II. Analysis table

**TABLE I. Reviewed sources**

| # | Source | Type | Approach | Key findings | Limitations | Relevance to VeriTalk |
|---|---|---|---|---|---|---|
| [1] | Shen et al., 2025 (AAAI) | Conference student abstract | LLMs prompted to classify caller-victim transcripts as scam or not | LLMs detect scam intent from conversation content | Biased datasets, low recall and hallucinations, as the authors report | Content-based detection works; VeriTalk needs a baseline comparison and a check on hallucinated evidence |
| [2] | Shen et al., 2025 (CHI EA) | Conference extended abstract | Real-time LLM detection on a growing transcript, compared with analysis after the call | Real-time recall is 0.98 to 1.00, but precision on synthetic data falls to 0.70 to 0.77, against 0.95 to 1.00 after the call | Chinese and English only; earlier warnings cost precision | Streaming mode (O4) will raise false alarms if it warns early, so we have to tune and report the threshold |
| [3] | Wang et al., 2025 (ACM MM) | Conference paper | A pluggable layer that sanitises transcripts (PII masking, keyword and TF-IDF representations, summaries) before LLM scam detection | Users can trade privacy for accuracy; stronger sanitisation lowers detection quality | Chinese transcripts; assumes a third-party LLM | Backs privacy by design; personal data should be masked before any external model sees it |
| [4] | Ma et al., 2025 (ACM MM) | Conference paper | 28,511 audio-text pairs (over 307 h) from anonymised real calls, LLM self-instruction and multi-agent synthesis; a fine-tuned audio LLM | Fine-tuned AntiFraud-Qwen2Audio reaches 83% average F1; GPT-4o reaches 72.17% | Chinese only; much of the data is synthetic | Synthetic augmentation is an accepted answer to data scarcity (O1), and task-specific fine-tuning beats a general LLM |
| [5] | Boussougou and Park, 2023 (Mathematics) | Journal article | Attention-based 1D CNN-BiLSTM with FastText embeddings on Korean voice phishing transcripts (KorCCVi v2) | 99.32% accuracy, 99.31% F1 | Small, clean, single-language dataset; near-perfect scores point to an easy test set; no explanation | The closest supervised vishing classifier outside English; its scores show why VeriTalk needs a held-out, realistic test set |
| [6] | Kim et al., 2025 (Applied Sciences) | Journal article | KoBERT transcript classifier with attention-based interpretation, fused with an MFCC and CNN-BiLSTM synthetic-voice detector | High accuracy, precision, recall and F1 on validation data and on noisy real calls; attention picks out phishing phrases | Korean only; one score mixes text and synthetic-voice signals | Supports a transformer text classifier with token-level evidence; treats synthetic voice detection as a separate problem, which the proposal leaves out of scope |
| [7] | Sim and Kim, 2025 | arXiv preprint | Small open LLMs (Llama3-8B and others) fine-tuned for voice phishing detection, with expert evaluation criteria in the prompt and an adversarial test set | Fine-tuned Llama3-8B is the best small model and comparable to a GPT-4-based detector; expert criteria help more than chain-of-thought | The authors wrote the transcripts; Korean only | A small self-hosted model can match a commercial LLM, and an explicit list of indicators improves detection |
| [8] | Wood et al., 2023 | arXiv preprint | Topic, time-series and emotion analysis of over 300 transcribed scam-baiting calls from YouTube | Scammers follow scripted stages and use different social-engineering tactics at each stage | Scam baiters are not real victims; English only | Basis for the indicator taxonomy and stage-aware scoring in streaming mode; a source of training calls when real ones are missing |
| [9] | Radford et al., 2023 (ICML) | Conference paper | Whisper: encoder-decoder ASR trained on 680,000 h of weakly supervised multilingual audio | Zero-shot recognition holds up across languages and recording conditions | Much weaker on low-resource languages such as Kazakh; offline model | The ASR model family chosen in VRT-6; we need to fine-tune it and report WER per language (O2) |
| [10] | Macháček et al., 2023 (IJCNLP-AACL demos) | Conference paper | Whisper-Streaming: a local agreement policy over a sliding audio buffer | Offline Whisper becomes a real-time system with a few seconds of delay | Delay and quality depend on hardware and chunk size; tested mainly on European languages | A ready design for incremental transcription in streaming mode (O4) |
| [11] | Mussakhojayeva et al., 2022 (Interspeech) | Conference paper | KSC2: a Kazakh corpus combining read and spontaneous speech | Over 1,000 h, including Kazakh-Russian code-switching | Little conversational telephone audio | Our main Kazakh fine-tuning set; shows that code-switching is common enough to plan for |
| [12] | Mussakhojayeva et al., 2023 (Information) | Journal article | 13 monolingual and 9 multilingual ASR models for ten Turkic languages | The best multilingual model cuts CER by 56.7% and WER by 54.3%; related Turkic languages help more than Russian or English | Read speech; no code-switching evaluation | Multilingual fine-tuning helps Kazakh, but adding Russian data will not fix Kazakh errors |
| [13] | Yeshpanov, 2026 (LREC) | Conference paper | Whisper fine-tuned on 4.5 h of Kazakh songs plus Common Voice and FLEURS | Zero-shot Whisper has 81.2% WER on KSC2; fine-tuning brings it to 39.3% | Still worse than models trained on KSC2 itself | Off-the-shelf Whisper handles Kazakh poorly, so we have to fine-tune it on KSC2 |
| [14] | Yeshpanov and Varol, 2024 (LREC-COLING) | Conference paper | KazSAnDRA: 180,064 Kazakh reviews; mBERT, XLM-R, RemBERT and mBART-50 fine-tuned for classification | The best model reaches F1 0.81 on positive/negative polarity and 0.39 on five-point scores | Sentiment, not fraud; written reviews, not speech transcripts | Multilingual encoders including XLM-R (VRT-6) handle binary Kazakh classification; fine-grained scales are much harder |
| [15] | Saha Roy et al., 2025 | arXiv preprint | PhishXplain: a small LLM (Llama 3.2) marks the suspicious elements of a phishing site in the warning; one month of deployment and a user study with 150 participants | It produced warnings for 94% of 7,091 live phishing sites, 96% of them correct; users who saw explanations understood phishing indicators better and spotted phishing more often than users with generic warnings | Web phishing, not calls | Supports working assumption 2: users understand a warning that names the reason better than a bare label, and a small model can write it in real time |
| [16] | Cau et al., 2025 | arXiv preprint | Controlled experiment with 750 participants comparing expert-written and LLM-generated explanations in phishing warnings | LLM-written explanations protect users about as well as expert-written ones; feature-based explanations help on real attacks, counterfactual ones cut false positives | Email phishing; results differ between preprint versions | VeriTalk can generate explanation text automatically if each explanation rests on a detected indicator |

## III. Critical review

### A. Approaches to content-based scam detection

Recent work falls into three groups. Supervised classifiers [5], [6] learn from labelled transcripts and report very high scores on small Korean datasets. [5] gives no explanation, and its near-perfect results more likely reflect an easy test set than real-world performance. [6] adds attention-based interpretation, but attention weights do not have to match the reasons for a decision, so they are weaker evidence than explicit indicators. General-purpose LLMs [1], [2], [3] need little task data and can justify their output in plain language. Shen et al. report low recall and hallucination in the zero-shot setting [1], and lower precision when the model has to decide before the call ends [2]. Fine-tuned task-specific models [4], [7] sit between the two. Ma et al. report a fine-tuned audio model that beats GPT-4o by about 11 F1 points [4], and Sim and Kim report a fine-tuned 8B model that matches a GPT-4-based detector once the prompt lists expert evaluation criteria [7].

The studies agree that call content carries enough signal to detect scams and that task-specific training beats general models. They part ways on reliability: the highest scores [5] come from the cleanest data, while the most realistic settings [2], [4] lose precision or F1. None of them tests on realistic, imbalanced, multilingual data, and none covers Russian or Kazakh. These gaps support the proposal's plan to compare the trained model with a keyword baseline (O3) and to report precision and recall separately.

### B. What is known about scam conversations

Wood et al. [8] find that scam calls follow scripted stages with tactics specific to each stage. Sim and Kim [7] find that expert knowledge of scam techniques, written as explicit criteria, improves detection more than generic reasoning. Both findings support describing fraud through observable indicators such as authority impersonation, urgency, requests for codes or transfers, and demands for secrecy. The stages in [8] also matter for streaming mode. Early stages such as the greeting and the claim of authority are weak evidence, and the decisive indicators tend to come later, which fits the trade-off between early warning and precision in [2].

The data behind these findings is thin. Sim and Kim wrote their own transcripts [7], Wood et al. used scam-baiter recordings [8], and Ma et al. rely on synthetic dialogues for much of their set [4]. None of the studies uses real scam calls from Kazakhstan, so local evidence has to come from the interviews planned in VRT-3.

### C. Speech recognition for Kazakh and code-switching

Every content-based detector depends on transcripts. The detection studies [1] to [8] either start from text or work in Chinese, Korean or English, where ASR is mature. Kazakh is harder. Open corpora exist [11], but they hold read and broadcast speech, with little telephone conversation. Off-the-shelf Whisper [9] reaches 81.2% WER on KSC2, and fine-tuning brings that down to 39.3% [13]. Multilingual training helps Kazakh, mostly through related Turkic languages; Russian data transfers poorly [12]. KSC2 shows that speakers switch between Kazakh and Russian often [11], yet none of the reviewed works measures ASR on code-switched conversation.

For streaming, Whisper-Streaming [10] shows that an offline model can produce a stable incremental transcript within a few seconds. Read together with [2], this means VeriTalk's streaming delay has two parts, the ASR delay and the time it takes to collect enough indicators, and we should report both.

### D. Text classification for Kazakh

KazSAnDRA [14] is the only primary study we found that fine-tunes XLM-R and similar multilingual encoders on a large Kazakh dataset. Its best model reaches F1 0.81 on binary polarity but only 0.39 on a five-point scale. VeriTalk can avoid the harder task by detecting each indicator as a yes/no decision and computing the 0 to 100 risk score from those decisions. A self-hosted encoder also fits two earlier findings: smaller fine-tuned models can match general LLMs [4], [7], and raw transcripts should stay away from third-party models [3]. The cost is labelled data, which brings back the scarcity problem that [4] addresses with synthetic augmentation.

### E. Explanations, warnings and privacy

Most detection studies report a label or a score and nothing else. LLM justifications can be hallucinated [1], and attention-based interpretation does not reliably explain a decision [6]. User studies of phishing warnings lead to the same design. Warnings that point to the concrete suspicious elements improved users' understanding and recognition of phishing compared with generic warnings [15]. Explanations written by an LLM protected users about as well as expert-written ones when they were built on specific features [16]. These results support working assumption 2 of the proposal and a design that ties each explanation to a detected indicator and its transcript segment. Both studies deal with web and email phishing, and one is a preprint, so our usability testing (O6) has to confirm the effect for phone calls.

On privacy, Wang et al. [3] are the only authors in this review who treat call content as sensitive data inside the detection pipeline. Their sanitisation layer costs measurable accuracy, which supports VeriTalk's choice to process audio on its own server, delete it after analysis, and keep transcripts away from external services.

## IV. Research gap and implications for VeriTalk

Recent research shows content-based scam detection in Chinese, Korean and English [1] to [8], and separately provides Kazakh speech and text resources [11] to [14]. No reviewed work combines the two. None of the reviewed studies detects scams in Russian, Kazakh or code-switched calls, measures how ASR errors carry into scam detection, or tests explanations for phone-call warnings with users.

VeriTalk takes the following limitations into account:

1. Scarce and synthetic data [4], [7], [8]. We build a corpus with a Kazakh and mixed-language subset, keep synthetic data out of the real test set, and report results per language (O1, O3).
2. Inflated scores on clean data [5]. We evaluate on held-out, realistic transcripts and against a keyword baseline (O3, O6).
3. Early warning versus precision [2], [8]. We report precision, recall and time to warning in streaming mode, and do not alert on early-stage indicators alone (O4).
4. Poor zero-shot Kazakh ASR [9], [12], [13]. We fine-tune Whisper on KSC2 and measure WER separately for Russian, Kazakh and code-switched audio (O2).
5. Fine-grained scores are hard to learn [14]. We detect indicators as binary decisions and compute the risk score from them (O3).
6. Unreliable explanations [1], [6], [15], [16]. Every explanation points to a detected indicator and a transcript segment, and we test comprehension with users (O3, O5, O6).
7. Privacy [3]. VeriTalk keeps no audio and sends no raw transcripts to external models.

## V. Limitations of this review

- Four sources [7], [8], [15], [16] are preprints without peer review. The authors of [7] report it as under revision at a journal.
- The five-year, primary-only rule leaves out foundational work such as the original XLM-R paper and studies of scam psychology. Where that work matters, we cite recent studies that build on it, for example [14] for XLM-R.
- We found no peer-reviewed study of phone-scam detection in Russian or Kazakh. This supports the gap, though local journals that our search tools do not index may hold such work.
- [2], [4], [5] and [7] use different datasets and metrics, so their numbers are not comparable.
- The abstracts of [6] and [7] give no exact metric values, so the table describes their results in words.

## References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand? (Student abstract)," in *Proc. AAAI Conf. Artif. Intell.*, 2025, pp. 29487–29489. [Online]. Available: <https://ojs.aaai.org/index.php/AAAI/article/view/35298>

[2] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," in *Extended Abstracts CHI Conf. Human Factors Comput. Syst. (CHI EA)*, 2025, doi: 10.1145/3706599.3720263. Open version: <https://arxiv.org/abs/2502.03964>

[3] K. Wang, Z. Shen, Y. Zhang, M. M. K. Cheung, X. Luo, G. Ngai, and E. Y. Fu, "One size fits all? A modular adaptive sanitization kit (MASK) for customizable privacy-preserving phone scam detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 12381–12389, doi: 10.1145/3746027.3758164. Open version: <https://arxiv.org/abs/2510.18493>

[4] Z. Ma *et al.*, "TeleAntiFraud-28k: An audio-text slow-thinking dataset for telecom fraud detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 5853–5862, doi: 10.1145/3746027.3755835. Open version: <https://arxiv.org/abs/2503.24115>

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

[15] S. Saha Roy, C. Torres, and S. Nilizadeh, "'Explain, don't just warn!' A real-time framework for generating phishing warnings with contextual cues," 2025, *arXiv:2505.06836*. [Online]. Available: <https://arxiv.org/abs/2505.06836>

[16] F. M. Cau, G. Desolda, F. Greco, L. D. Spano, and L. Viganò, "Can large language models automate phishing warning explanations? A controlled experiment on effectiveness and user perception," 2025, *arXiv:2507.07916*. [Online]. Available: <https://arxiv.org/abs/2507.07916>
