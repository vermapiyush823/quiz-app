import json
import re

# Read current questions
with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'r') as f:
    existing_questions = json.load(f)

# Questions from moreq.txt
moreq_items = [
  {
    "category": "CSDM & Lifecycle",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A customer's CMDB is aligned to the CSDM Walk stage. What benefit is provided by the CMDB?",
    "options": [
      "Allows for additional stratification of technical teams' support structure along the lines of OLAs and commitments",
      "Improves the implementation velocity of APM Foundation for future business application rationalization",
      "Enables impact assessments for incident, problem, and change on Business Services",
      "Enables automated real-time discovery of microservice containers"
    ],
    "correctIndices": [2],
    "explanation": "In the CSDM Walk stage, foundational service models (especially Business Services and their relationships to underlying technical components) are established. This immediately enables reliable impact assessments for Incident, Problem, and Change Management on Business Services."
  },
  {
    "category": "CMDB Health & Dashboards",
    "difficulty": "medium",
    "multiSelect": True,
    "question": "The Configuration Manager is preparing justification to utilize the CMDB Data Foundations Dashboard. Which benefits align with the usage of this dashboard? (Choose 2 options)",
    "options": [
      "It automates approval processes for Change Management",
      "It provides actionable insights to improve data quality and completeness",
      "It helps detect and eliminate duplicate records in the CMDB directly",
      "It enables monitoring and tracking of CMDB health over time"
    ],
    "correctIndices": [1, 3],
    "explanation": "The CMDB Data Foundations Dashboard provides actionable insights to improve data quality and completeness via Get Well Playbooks, and enables organizations to monitor and track CMDB health trends over time."
  },
  {
    "category": "CSDM & Lifecycle",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "The CMDB Configuration Management team integrated discovered infrastructure data, referenced non-discoverable data (support groups), and used Service Mapping. Which field on an Incident form is automatically populated after a CI is selected that references an appropriate support group?",
    "options": [
      "Managed by Group",
      "Approval Group",
      "Assignment Group",
      "Change Group"
    ],
    "correctIndices": [2],
    "explanation": "When a CI is selected on an Incident record, ServiceNow evaluates the CI's Support Group attribute and automatically populates it into the Incident's Assignment Group field for automated ticket routing."
  },
  {
    "category": "CSDM & Lifecycle",
    "difficulty": "hard",
    "multiSelect": False,
    "question": "In a company, different stakeholders listed several use cases they expect over time. Which use case requires Information Objects in CSDM?",
    "options": [
      "The Asset Management team wants to understand asset lifecycle compliance in a Business Application context",
      "The Event Operations team wants to automate their events into incidents for operational actions",
      "The Customer Service team wants to onboard proactive case management",
      "The SecOps team wants to understand operational risk in the Business Application context"
    ],
    "correctIndices": [0],
    "explanation": "Information Objects in CSDM represent non-CI logical/governance data entities (such as data classifications, regulated data, or asset lifecycle compliance milestones) associated with Business Applications without converting non-operational records into CIs."
  },
  {
    "category": "CMDB Data Manager & Governance",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "What is the primary difference between Data Certification and Attestation policies when managing a CI?",
    "options": [
      "Attestation requires correcting specific attributes of a CI, while Data Certification tracks acknowledgement the CI still exists",
      "Attestation can be scheduled, while Data Certification cannot be scheduled",
      "Attestation can be assigned to a group or an individual, while Data Certification can only be assigned to an individual",
      "Attestation tracks acknowledgement the CI still exists, while Data Certification requires validating specific attributes of a CI"
    ],
    "correctIndices": [3],
    "explanation": "Attestation is a lightweight process confirming CI existence and ownership ('Does this CI still exist?'), whereas Data Certification is a rigorous process validating specific attributes (lifecycle state, support group, location, environment) on the CI."
  },
  {
    "category": "CMDB Data Manager & Governance",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "CMDB class owners are receiving governance tasks under the 'My Work' tab in the CMDB Workspace. Which CMDB management tool is generating those tasks?",
    "options": [
      "De-duplication templates",
      "CMDB Data Manager",
      "CMDB Health Dashboard",
      "Discovery Schedules"
    ],
    "correctIndices": [1],
    "explanation": "CMDB Data Manager is the capability responsible for generating and assigning actionable lifecycle governance tasks (attestation, certification, retirement, archiving) that surface under 'My Work' in CMDB Workspace."
  },
  {
    "category": "CMDB Health & Dashboards",
    "difficulty": "hard",
    "multiSelect": False,
    "question": "The CMDB Administrator group aims to display meaningful results on the CMDB Health Dashboard Compliance Scorecard for server records not on the latest patch. What must be configured to achieve this goal?",
    "options": [
      "Certification Filter, Certification Template, Audit",
      "Technical Service Offerings, Dynamic CI Groups, CMDB Groups",
      "Stale, Orphan, Duplicate metrics",
      "Certification Policies, Data Filters, Scheduled Jobs"
    ],
    "correctIndices": [3],
    "explanation": "In ServiceNow, the Compliance dimension on CMDB Health Dashboard is driven by Data Certification: Certification Policies (defining validation rules/patch criteria), Data Filters (scoping to server classes), and Scheduled Jobs (automating regular evaluation)."
  },
  {
    "category": "Ingest & Integrations",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "An organization is changing data centers and needs to know the consequences of planned changes. How can Application Service Mapping be used as part of Change Management?",
    "options": [
      "To identify which devices will go offline first",
      "To understand the business impact of CIs",
      "To understand the physical location of CIs",
      "To automate network port shutoffs"
    ],
    "correctIndices": [1],
    "explanation": "Application Service Mapping connects technical infrastructure to Business Services. During data center migrations or changes, Change Managers use service maps to understand downstream business impact and notify affected stakeholders."
  }
]

# Add any new questions from moreq_items that aren't exact duplicates
start_id = len(existing_questions) + 1
for item in moreq_items:
    # Check if question text is already in existing_questions
    is_dup = False
    for eq in existing_questions:
        if item["question"].strip().lower()[:50] == eq["question"].strip().lower()[:50]:
            # Update explanation with richer text if found
            eq["explanation"] = item["explanation"]
            is_dup = True
            break
    if not is_dup:
        item["id"] = start_id
        start_id += 1
        existing_questions.append(item)

# Re-number all questions sequentially
for idx, q in enumerate(existing_questions, start=1):
    q["id"] = idx

with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'w') as f:
    json.dump(existing_questions, f, indent=2)

print(f"Total questions in questions.json now: {len(existing_questions)}")
