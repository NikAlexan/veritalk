# VeriTalk

**Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence**

VeriTalk is a mobile application with a server-side artificial intelligence component that assesses the fraud risk of a phone conversation on the basis of its content and explains the assessment to the user.

## Problem Statement

Telephone fraud based on social engineering causes substantial financial losses in Kazakhstan. Existing countermeasures operate predominantly on call metadata, such as caller number reputation and operator-side blocking, and do not analyse what is said during the call. Content-based detection approaches reported in the literature have not been adapted to the Russian–Kazakh bilingual setting or made available to end users in an explainable form.

## Target Users

- Mobile phone users in Kazakhstan who receive calls in Russian or Kazakh, particularly groups at elevated risk of social engineering.
- Family members who assist vulnerable users in assessing suspicious calls.

## Expected Outcomes

- A functional prototype comprising a mobile application and a server supporting recording-based and near real-time analysis.
- An annotated corpus of Russian and Kazakh phone conversations and a documented taxonomy of fraud indicators.
- A trained risk assessment model evaluated against a rule-based baseline.
- An evaluation report covering classification quality, latency and usability.

## Team

| Member | Area | Responsibilities |
| --- | --- | --- |
| Nikita Vasilenko | Backend | Speech recognition pipeline, server API, streaming analysis mode |
| Danial Seit | Frontend | Mobile client, UX design and prototyping, usability testing; project management |
| Abilkaiyr Ozbekbay | Machine learning | Dataset collection and annotation, risk model development and evaluation |

**Supervisor:** Azamat Serek, PhD, Associate Professor, School of Software Engineering, Astana IT University.

Group SE-2410, Astana IT University.

## Scope

**Included:** analysis of uploaded call recordings; near real-time analysis of calls on speakerphone; Russian and Kazakh, including code-switched conversations; fraud and social engineering risk with indicator-level explanations; no retention of call audio.

**Excluded:** direct capture of call audio from the telephony stack, automatic call blocking, synthetic voice detection, integration with banking or operator systems.

The full proposal is available in [docs/01-proposal.md](docs/01-proposal.md).
