# Literature Review

**Project:** VeriTalk — Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-4 Literature review
**Accessed:** Oct. 20, 2026

## I. Purpose and Method

This review establishes what is already known about detecting telephone fraud from conversation content, which approaches exist, and which of their limitations VeriTalk must take into account. It complements the existing system comparison [04-existing-systems.md](04-existing-systems.md), which covers commercial and operator products; this document covers research.

Sources were selected along the stages of the VeriTalk pipeline and the problems listed in the proposal (Section IX): (A) scam detection from call content, (B) the structure of scam conversations and the people they target, (C) speech recognition for Kazakh, Russian and code-switched speech, including streaming, (D) multilingual text classification, and (E) explainability, warnings and privacy. Search was carried out in Google Scholar, the ACL Anthology, arXiv and publisher sites using combinations of "phone scam", "voice phishing", "vishing", "social engineering", "Kazakh speech recognition", "code-switching", "Whisper streaming", "rationales" and "security warnings". Inclusion rules: (a) the work is directly used to make a design or evaluation decision in VeriTalk, (b) it has a DOI or a stable link, and (c) it was published in 2021 or later, unless it is a foundational work that later studies build on.

Eighteen sources were retained. Sixteen are peer-reviewed (journal articles, conference papers and one peer-reviewed student abstract); two are arXiv preprints, used because they are the most recent work on their topic. Thirteen sources date from 2021–2026; five are foundational works (2011–2020).

## II. Analysis Table

**TABLE I. Reviewed sources**

| # | Source | Type | Approach | Key findings | Limitations | Relevance to VeriTalk |
|---|---|---|---|---|---|---|
| [1] | Shen et al., 2025 (AAAI student abstract; full text arXiv 2024) | Peer-reviewed abstract | Prompting LLMs to classify caller–victim transcripts as scam or not | LLMs can detect scam intent from conversation content | Authors report biased datasets, relatively low recall and hallucinations | Confirms content-based detection is feasible; motivates a baseline comparison and checks against hallucinated evidence |
| [2] | Shen et al., 2025 | arXiv preprint | Real-time LLM detection on incrementally growing transcripts, compared with retrospective analysis | Real-time recall 0.98–1.00; precision drops to 0.70–0.77 on synthetic data versus 0.95–1.00 retrospectively | Chinese and English only; trade-off between timeliness and precision; preprint | Directly informs the streaming mode (O4): early warnings cost false alarms, so the threshold must be tuned and reported |
| [3] | Wang et al., 2025 (MASK, ACM MM) | Conference paper | Pluggable sanitisation layer (PII masking, keyword/TF-IDF representations, summarisation) before LLM scam detection | Privacy can be traded off against accuracy per user; stronger sanitisation lowers detection quality | Evaluated on Chinese transcripts; assumes third-party LLM processing | Supports privacy-by-design; suggests masking personal data before any external model call |
| [4] | Ma et al., 2025 (TeleAntiFraud-28k, ACM MM) | Conference paper | Audio–text dataset of 28,511 pairs (over 307 h) built from anonymised real calls, LLM self-instruction and multi-agent synthesis; fine-tuned audio LLM | Fine-tuned AntiFraud-Qwen2Audio reaches 83% average F1 versus 72.17% for GPT-4o | Chinese only; much of the data is synthetic | Shows synthetic augmentation is an accepted way around data scarcity (O1), and that task-specific fine-tuning beats general LLMs |
| [5] | Derakhshan et al., 2021 (ASsET, IWSPA) | Workshop paper | Scam "signatures" as sets of speech acts, matched to utterances with sentence embeddings | Signatures separate scam from non-scam calls with high accuracy | Dataset written by volunteers from published scam examples; English only | Basis for an indicator taxonomy: indicators as speech acts (request code, impersonate authority) rather than keywords |
| [6] | Boussougou and Park, 2023 (Mathematics) | Journal article | Attention-based 1D CNN–BiLSTM with FastText embeddings on Korean voice phishing transcripts (KorCCVi v2) | 99.32% accuracy, 99.31% F1 | Small, clean, single-language dataset; near-perfect scores suggest an easy test set; no explanation | Closest example of a supervised non-English vishing classifier; its scores show why a held-out, realistic test set is required |
| [7] | Wood et al., 2023 | arXiv preprint | Topic, time-series and emotion analysis of over 300 transcribed scam-baiting calls from YouTube | Scams follow scripted stages, each with its own social-engineering tactics | Scam-baiter calls are not real victim calls; English only | Supports stage-aware scoring in streaming mode and a corpus source when real calls are unavailable |
| [8] | Stajano and Wilson, 2011 (CACM) | Journal article (foundational) | Analysis of staged scams to derive victim behaviour principles | Seven principles: distraction, social compliance, herd, dishonesty, kindness, need and greed, time | Qualitative; not computational | Grounds the indicator taxonomy (authority, urgency, secrecy) in established scam psychology |
| [9] | Burnes et al., 2017 (AJPH) | Systematic review (foundational) | Meta-analysis of 12 studies with 41,711 older adults | Annual fraud prevalence among older US adults about 5.4% | US data; self-reported victimisation | Justifies the focus on older adults and family helpers as target users |
| [10] | Radford et al., 2023 (Whisper, ICML) | Conference paper | Encoder–decoder ASR trained on 680,000 h of weakly supervised multilingual audio | Robust zero-shot recognition across languages and conditions | Quality for low-resource languages such as Kazakh is much lower than for English; offline model | Chosen ASR model family (VRT-6); requires fine-tuning and per-language WER (O2) |
| [11] | Macháček et al., 2023 (IJCNLP-AACL demos) | Conference paper | Whisper-Streaming: local agreement policy over a sliding audio buffer | Turns offline Whisper into a real-time system with a latency of a few seconds | Latency and quality depend on hardware and chunk size; evaluated mainly on European languages | Direct design pattern for incremental transcription in streaming mode (O4) |
| [12] | Khassanov et al., 2021 (KSC, EACL) | Conference paper | Crowdsourced open-source Kazakh speech corpus with an ASR baseline | First large open Kazakh speech corpus; usable baseline WER | Read speech, not telephone conversations | Training and test data for Kazakh ASR |
| [13] | Mussakhojayeva et al., 2022 (KSC2, Interspeech) | Conference paper | Industrial-scale Kazakh corpus combining read and spontaneous sources | Over 1,000 h; contains Kazakh–Russian code-switching | Little conversational telephone audio | Main Kazakh fine-tuning set; evidence that code-switching is common and must be handled |
| [14] | Mussakhojayeva et al., 2023 (Information) | Journal article | 13 monolingual and 9 multilingual ASR models for ten Turkic languages | Best multilingual model cuts CER and WER by 56.7% and 54.3%; related Turkic languages help more than Russian or English | Read speech; no code-switching evaluation | Suggests multilingual fine-tuning helps Kazakh, but Russian data alone will not fix Kazakh errors |
| [15] | Yeshpanov, 2026 (LREC) | Conference paper | Fine-tuning Whisper on 4.5 h of Kazakh songs plus CVC and FLEURS | Zero-shot Whisper WER on KSC2 is 81.2%; fine-tuning lowers it to 39.3% | Still worse than models trained on KSC2 itself | Quantifies how poorly off-the-shelf Whisper handles Kazakh, so fine-tuning on KSC2 is mandatory |
| [16] | Conneau et al., 2020 (XLM-R, ACL) | Conference paper (foundational) | Multilingual masked language model pretrained on about 100 languages of CommonCrawl text | Large gains over mBERT, especially for low-resource languages | Large model; needs task fine-tuning | Chosen classifier backbone (VRT-6) for Russian, Kazakh and mixed transcripts |
| [17] | DeYoung et al., 2020 (ERASER, ACL) | Conference paper (foundational) | Benchmark and metrics for model rationales (supporting text spans) | Rationales can be measured for agreement with humans and for faithfulness to the prediction | General NLP tasks, not fraud | Gives a way to evaluate VeriTalk's evidence segments, not only the risk score (O3) |
| [18] | Felt et al., 2015 (CHI) | Conference paper (foundational) | Redesign of Chrome SSL warnings tested by surveys and a field experiment | Opinionated design made about 30% more users choose the safe option; comprehension stayed low | Browser context, not phone calls | Guides warning design: a clear recommended action matters more than technical detail |

## III. Critical Review

### A. Approaches to Content-Based Scam Detection

Three families of approaches appear in the literature. **Rule and signature methods** [5] describe a scam as a set of speech acts and match them semantically. They are interpretable by construction, since every match points to an utterance, but their coverage is limited to the scam types written into the signatures. **Supervised neural classifiers** [6] learn from labelled transcripts and report very high scores, but on small, clean, single-language data; they give no explanation, and their near-perfect results are more likely to reflect an easy test set than real-world performance. **Large language models** [1]–[4] need little or no task-specific data and can produce a natural-language justification. However, Shen et al. report low recall and hallucination in the zero-shot setting [1], and a fall in precision when the model must decide before the call ends [2]. Ma et al. show that fine-tuning on a task-specific dataset closes much of the gap: their fine-tuned audio model outperforms GPT-4o by about 11 F1 points [4].

The sources therefore agree that content carries enough signal to detect scams, but disagree on how reliable detection is in practice, and none reports results on realistic, imbalanced, multilingual data. This supports the proposal's decision to compare the trained model with a keyword-based baseline rather than to report the model alone (O3), and to report precision and recall separately.

### B. What Is Known About Scam Conversations

The behavioural work is consistent. Stajano and Wilson identify the psychological levers scammers use [8]; Wood et al. find that real scam calls follow scripted stages with stage-specific tactics [7]; Derakhshan et al. encode the same idea as speech-act signatures [5]. Together they justify representing fraud as a set of observable indicators (authority impersonation, urgency, requests for codes or transfers, secrecy) rather than as a single label. Wood et al. [7] also suggest that indicators appear in order, which matters for streaming mode: early stages (greeting, authority claim) are weak evidence, and the decisive indicators often come later. This is consistent with the timeliness–precision trade-off reported in [2].

Burnes et al. [9] show that fraud against older adults is common, but their data is from the US. No reviewed study measures phone-scam victimisation in Kazakhstan, so local relevance must come from the interviews planned in VRT-3.

### C. Speech Recognition for Kazakh and Code-Switching

All content-based detectors depend on transcripts, yet the detection studies [1]–[7] either start from text or work in Chinese, English or Korean, where ASR is mature. For Kazakh the picture is different. Open corpora exist [12], [13], but they consist mostly of read or broadcast speech, not telephone conversations. Off-the-shelf Whisper performs poorly on Kazakh (81.2% WER on KSC2 zero-shot) and fine-tuning lowers this substantially [15]. Multilingual training helps, but mainly with related Turkic languages; Russian data alone does not transfer well to Kazakh [14]. KSC2 documents frequent Kazakh–Russian code-switching [13], yet none of the reviewed works evaluates ASR specifically on code-switched conversational speech.

For streaming mode, Whisper-Streaming [11] shows that an offline model can produce a stable incremental transcript within a few seconds. Combined with [2], this means that VeriTalk's streaming latency is the sum of ASR delay and the time needed to collect enough indicators, and both should be reported.

### D. Classification Model

XLM-R [16] is the standard multilingual encoder for low-resource languages and covers both Russian and Kazakh, which makes it a reasonable alternative to calling an external LLM. It is consistent with the findings in [4] that a smaller fine-tuned model can beat a general LLM, and with the privacy concern in [3], since the model can run on the project's own server. Its drawback relative to LLMs is the need for labelled data, which brings back the data scarcity problem addressed through synthetic augmentation in [4].

### E. Explainability, Warnings and Privacy

Most detection studies report only a label or score. Signature matching [5] and LLM justifications [1] provide explanations, but LLM explanations can be hallucinated [1]. ERASER [17] offers a way to check whether highlighted evidence is both plausible to people and faithful to the model's decision, which fits VeriTalk's requirement that each indicator be supported by transcript segments. Felt et al. [18] show that people often do not understand security warnings even when they act on them, and that a clear recommended action matters most. This tempers the proposal's working assumption 2: evidence may increase trust, but the interface still needs a short, direct recommendation, and this should be tested in usability evaluation (O6).

On privacy, Wang et al. [3] are the only reviewed work that treats call content as sensitive data inside the detection pipeline. They show a measurable cost in accuracy when content is sanitised before analysis, which supports VeriTalk's choice to process audio on its own server and delete it after analysis rather than to send transcripts to external services.

## IV. Research Gap and Implications for VeriTalk

**Gap.** The reviewed research demonstrates content-based scam detection in Chinese, English and Korean [1]–[7], and separately provides Kazakh speech resources [12]–[15]. No reviewed work combines them: there is no study of scam detection on Russian, Kazakh or code-switched calls, no evaluation of ASR errors propagating into scam detection, and little evaluation of explanations shown to end users.

**Limitations the project takes into account:**

1. **Data scarcity and bias** [1], [4], [6]: build a corpus with a Kazakh and mixed subset, use synthetic augmentation with a clearly separated real test set, and report results per language (O1, O3).
2. **Inflated scores on clean data** [6]: evaluate on held-out, realistic transcripts and against a keyword baseline (O3, O6).
3. **Timeliness versus precision** [2], [7]: report precision, recall and time-to-warning in streaming mode; avoid alerting on early-stage indicators alone (O4).
4. **Poor zero-shot Kazakh ASR** [10], [14], [15]: fine-tune Whisper on KSC2 and measure WER separately for Russian, Kazakh and code-switched audio (O2).
5. **Hallucinated or unfaithful explanations** [1], [17]: tie every indicator to a transcript segment and evaluate the segments, not only the score (O3).
6. **Warning comprehension** [18]: pair evidence with a clear recommended action and test it with users (O5, O6).
7. **Privacy** [3]: no audio retention and no external model calls with raw transcripts.

## V. Limitations of This Review

- Two sources [2], [7] are preprints and have not been peer-reviewed; [1] is cited from its peer-reviewed abstract, with details from the longer preprint.
- No peer-reviewed study on phone-scam detection in Russian or Kazakh was found. This supports the gap but may also reflect publications in local journals not indexed by the search tools used.
- Detection results in [2], [4], [6] are reported on different datasets and metrics and cannot be compared numerically.
- Statistics on fraud in Kazakhstan come from news sources cited in the proposal, not from peer-reviewed studies.

## References

[1] Z. Shen, K. Wang, Y. Zhang, G. Ngai, and E. Y. Fu, "Combating phone scams with LLM-based detection: Where do we stand? (Student abstract)," in *Proc. AAAI Conf. Artif. Intell.*, 2025, pp. 29487–29489. [Online]. Available: <https://ojs.aaai.org/index.php/AAAI/article/view/35298>. Extended version: *arXiv:2409.11643*, 2024.

[2] Z. Shen, S. Yan, Y. Zhang, X. Luo, G. Ngai, and E. Y. Fu, "'It warned me just at the right moment': Exploring LLM-based real-time detection of phone scams," 2025, *arXiv:2502.03964*. [Online]. Available: <https://arxiv.org/abs/2502.03964>

[3] K. Wang, Z. Shen, Y. Zhang, M. M. K. Cheung, X. Luo, G. Ngai, and E. Y. Fu, "One size fits all? A modular adaptive sanitization kit (MASK) for customizable privacy-preserving phone scam detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 12381–12389. [Online]. Available: <https://arxiv.org/abs/2510.18493>

[4] Z. Ma *et al.*, "TeleAntiFraud-28k: An audio-text slow-thinking dataset for telecom fraud detection," in *Proc. 33rd ACM Int. Conf. Multimedia (MM)*, 2025, pp. 5853–5862, doi: 10.1145/3746027.3755835.

[5] A. Derakhshan, I. G. Harris, and M. Behzadi, "Detecting telephone-based social engineering attacks using scam signatures," in *Proc. ACM Workshop Security Privacy Analytics (IWSPA)*, 2021, pp. 67–73. [Online]. Available: <https://par.nsf.gov/biblio/10250241>

[6] M. K. Moussavou Boussougou and D.-J. Park, "Attention-based 1D CNN-BiLSTM hybrid model enhanced with FastText word embedding for Korean voice phishing detection," *Mathematics*, vol. 11, no. 14, Art. no. 3217, 2023, doi: 10.3390/math11143217.

[7] I. D. Wood, M. Kepkowski, L. Zinatullin, T. Darnley, and M. A. Kaafar, "An analysis of scam baiting calls: Identifying and extracting scam stages and scripts," 2023, *arXiv:2307.01965*. [Online]. Available: <https://arxiv.org/abs/2307.01965>

[8] F. Stajano and P. Wilson, "Understanding scam victims: Seven principles for systems security," *Commun. ACM*, vol. 54, no. 3, pp. 70–75, 2011, doi: 10.1145/1897852.1897872.

[9] D. Burnes, C. R. Henderson, C. Sheppard, R. Zhao, K. Pillemer, and M. S. Lachs, "Prevalence of financial fraud and scams among older adults in the United States: A systematic review and meta-analysis," *Am. J. Public Health*, vol. 107, no. 8, pp. e13–e21, 2017, doi: 10.2105/AJPH.2017.303821.

[10] A. Radford, J. W. Kim, T. Xu, G. Brockman, C. McLeavey, and I. Sutskever, "Robust speech recognition via large-scale weak supervision," in *Proc. 40th Int. Conf. Mach. Learn. (ICML)*, PMLR vol. 202, 2023, pp. 28492–28518. [Online]. Available: <https://proceedings.mlr.press/v202/radford23a.html>

[11] D. Macháček, R. Dabre, and O. Bojar, "Turning Whisper into real-time transcription system," in *Proc. 13th Int. Joint Conf. Natural Lang. Process. and 3rd Conf. Asia-Pacific Chapter ACL: System Demonstrations*, 2023, pp. 17–24. [Online]. Available: <https://aclanthology.org/2023.ijcnlp-demo.3>

[12] Y. Khassanov, S. Mussakhojayeva, A. Mirzakhmetov, A. Adiyev, M. Nurpeiissov, and H. A. Varol, "A crowdsourced open-source Kazakh speech corpus and initial speech recognition baseline," in *Proc. 16th Conf. Eur. Chapter Assoc. Comput. Linguistics (EACL)*, 2021, pp. 697–706, doi: 10.18653/v1/2021.eacl-main.58.

[13] S. Mussakhojayeva, Y. Khassanov, and H. A. Varol, "KSC2: An industrial-scale open-source Kazakh speech corpus," in *Proc. Interspeech*, 2022, pp. 1367–1371, doi: 10.21437/Interspeech.2022-421.

[14] S. Mussakhojayeva, K. Dauletbek, R. Yeshpanov, and H. A. Varol, "Multilingual speech recognition for Turkic languages," *Information*, vol. 14, no. 2, Art. no. 74, 2023, doi: 10.3390/info14020074.

[15] R. Yeshpanov, "Using songs to improve Kazakh automatic speech recognition," in *Proc. 15th Lang. Resources Eval. Conf. (LREC)*, 2026, pp. 5528–5537. [Online]. Available: <https://aclanthology.org/2026.lrec-1.431/>

[16] A. Conneau *et al.*, "Unsupervised cross-lingual representation learning at scale," in *Proc. 58th Annu. Meeting Assoc. Comput. Linguistics (ACL)*, 2020, pp. 8440–8451, doi: 10.18653/v1/2020.acl-main.747.

[17] J. DeYoung *et al.*, "ERASER: A benchmark to evaluate rationalized NLP models," in *Proc. 58th Annu. Meeting Assoc. Comput. Linguistics (ACL)*, 2020, pp. 4443–4458, doi: 10.18653/v1/2020.acl-main.408.

[18] A. P. Felt *et al.*, "Improving SSL warnings: Comprehension and adherence," in *Proc. ACM Conf. Human Factors Comput. Syst. (CHI)*, 2015. [Online]. Available: <https://research.google/pubs/pub43265/>
