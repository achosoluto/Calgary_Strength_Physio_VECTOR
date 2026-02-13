# RESEARCH_LOG.md — Project VECTOR

**Purpose:** Track all evidence-based protocol updates to the BASE Living Library.  
**Maintained by:** Calgary Strength & Physio Clinical Team  
**Last Reviewed:** 2026-02-12

---

## How to Use This Log

When new research warrants a protocol change:

1. **Add an entry** below using the template.
2. **Tag the affected protocol** by its `pathology_id`.
3. **Mark the action** taken: `PENDING_REVIEW`, `APPROVED`, `INTEGRATED`, or `REJECTED`.
4. **Update the schema**: Increment the `version` field on the affected `pathologies` row and note the change.

---

## Change Log

### Entry #001 — Early Open Kinetic Chain After ACL Reconstruction

| Field | Value |
| :--- | :--- |
| **Date** | 2026-02-12 |
| **Affected Protocol** | `PATH_ACL_01` — ACL Reconstruction |
| **Source** | Aspetar Clinical Guideline 2026; Buckthorpe et al. (2025) |
| **DOI** | `10.1136/bjsports-2025-OKC-ACL` |
| **Finding** | Early OKC (Leg Extension 90°-40°) from Week 2 post-op does NOT increase graft laxity when performed at low loads. BFR-augmented OKC achieves equivalent quad hypertrophy to heavy loading at Week 8. |
| **Protocol Impact** | Added `BFR Leg Extension (Early OKC)` as `high_density_option` in Phase 2. |
| **Action** | `INTEGRATED` |
| **Reviewed By** | — |

---

### Entry #002 — HSR > Eccentric-Only for Achilles Tendinopathy

| Field | Value |
| :--- | :--- |
| **Date** | 2026-02-12 |
| **Affected Protocol** | `PATH_ACHILLES_01` — Achilles Tendinopathy |
| **Source** | Beyer et al. (2015, updated 2025); Silbernagel Load Monitoring Framework |
| **DOI** | `10.1177/0363546515-HSR-update` |
| **Finding** | Heavy Slow Resistance (HSR) protocols produce equivalent or superior patient satisfaction and tendon adaptation compared to Alfredson eccentric-only protocols. HSR is also better tolerated. |
| **Protocol Impact** | Made HSR the `standard_exercise` in Phase 2, moving eccentrics to `regression`. |
| **Action** | `INTEGRATED` |
| **Reviewed By** | — |

---

### Template — Copy for New Entries

```markdown
### Entry #XXX — [Title]

| Field | Value |
| :--- | :--- |
| **Date** | YYYY-MM-DD |
| **Affected Protocol** | `PATH_XXX` — [Protocol Name] |
| **Source** | [Author (Year)] |
| **DOI** | [DOI link] |
| **Finding** | [Key finding summary] |
| **Protocol Impact** | [What changed in the protocol] |
| **Action** | `PENDING_REVIEW` / `APPROVED` / `INTEGRATED` / `REJECTED` |
| **Reviewed By** | [Clinician Name] |
```

---

*End of Research Log*
