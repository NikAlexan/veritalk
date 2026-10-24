# Supervisor Feedback

**Project:** VeriTalk. Development of an Application for Assessing the Risk of Phone Conversations Using Artificial Intelligence
**Task:** VRT-12 Supervisor review and feedback
**Supervisor:** Azamat Serek, PhD, Associate Professor, School of Software Engineering
**Date:** Oct. 24, 2026
**Status:** Submitted for pre-defense 1; written supervisor comments not yet received

## I. Purpose

This document records the supervisor's review of the pre-defense 1 deliverables and the team's decision on each comment. A comment counts as closed when the team has fixed it in a merged pull request or has agreed with the supervisor that no change is needed (acceptance criterion of VRT-12).

## II. Reviews

| Date | Reviewed | Outcome |
| --- | --- | --- |
| Oct. 19, 2026 | Individual work plans of all three team members | The supervisor approved the plans (gate Ready for Planning, `09-risks-and-management.md`, Table III, M0) |
| Oct. 24, 2026 | Consolidated pre-defense 1 report built from `main` at commit a2a9308 (documents 01 to 09, diagrams, prototype) | Sent to the supervisor for review. No written comments had arrived by the submission deadline |

## III. Self-Review Submitted with the Report

While waiting for the supervisor's comments, the team checked the deliverables against the pre-defense 1 requirements and sent the findings below together with the report. These are the team's own findings. The supervisor has not yet confirmed them.

| # | Deliverable | Finding | Decision | Change | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | `09-risks-and-management.md` | The plan referred to the verification plan (08) and this document (10), which did not exist yet | Fixed | `08-verification-plan.md` merged in [PR #16](https://github.com/NikAlexan/veritalk/pull/16); this document added | Closed |
| 2 | `06-requirements.md` | Numeric targets for WER, F1 and latency were marked (P) and had no measurement method | Fixed in part | `08-verification-plan.md` defines metrics, conditions and the baseline ([PR #16](https://github.com/NikAlexan/veritalk/pull/16)); values marked (P) stay provisional until the first measurements | Open |
| 3 | `02-relevance-evidence.md` | Five of six interview participants are university students, so older users and family members are under-represented | Deferred | Repeat interviews before pre-defense 2, as planned for risk R7 in `09-risks-and-management.md` | Open |
| 4 | YouTrack project VRT | All tasks carry the default priority Normal | Open | Project manager to set priorities in YouTrack | Open |
| 5 | Merged pull requests | Each merged pull request has an approval from another member, but most reviews contain no written comments | Open | To discuss with the supervisor at the next weekly meeting | Open |

## IV. Outcome

The supervisor approved the individual work plans on Oct. 19, 2026. The pre-defense 1 report went to the supervisor on Oct. 24, 2026, and no written comments had arrived by the deadline. The team will add the supervisor's comments to Section III with a decision for each and will report them at the next review.
