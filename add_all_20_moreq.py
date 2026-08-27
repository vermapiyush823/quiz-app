import json

moreq_questions = [
  {
    "source": "moreq.txt Q1",
    "category": "CSDM & Lifecycle",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A CMDB Administrator is implementing Vulnerability Response or Security Incident Response and needs to ensure customers have enough context to estimate risk and set task priorities. Which Get Well Playbook from the CSDM Data Foundations Dashboard helps with this?",
    "options": [
      "Locations without a Parent Location",
      "Application Services with Business Application Relationships",
      "Named Product Models without Product Owners",
      "Percentage of Custom Status Values for CI Life Cycle Stages"
    ],
    "correctIndices": [1],
    "explanation": "In ServiceNow, Vulnerability Response and Security Incident Response rely heavily on business context. The 'Application Services with Business Application Relationships' Get Well Playbook directly addresses this by relating deployable technical services to logical business applications, enabling risk-based prioritization based on affected business processes."
  },
  {
    "source": "moreq.txt Q2",
    "category": "Ingest & Integrations",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "An organization is changing data centers and needs to know the consequences of the planned changes. How can Application Service Mapping be used as part of Change Management?",
    "options": [
      "To identify which devices will go offline first",
      "To understand the business impact of CIs",
      "To understand the physical location of CIs",
      "To automate infrastructure shutdown sequences"
    ],
    "correctIndices": [1],
    "explanation": "Application Service Mapping connects technical CIs to Application Services and Business Services. This allows Change Managers to see which customer-facing or revenue-generating business services are impacted by data center moves and changes."
  },
  {
    "source": "moreq.txt Q3",
    "category": "Ingest & Integrations",
    "difficulty": "medium",
    "multiSelect": True,
    "question": "Configuration Management requires an accurate inventory of devices to be reflected in the CMDB. Which are common use cases for using Agent Client Collector (ACC)? (Choose 2 options)",
    "options": [
      "Servers in the data center",
      "Network devices in the DMZ",
      "Devices in secure environments",
      "Devices that intermittently connect to the network"
    ],
    "correctIndices": [2, 3],
    "explanation": "ACC runs locally on endpoints and is specifically suited for: (1) Devices in secure/restricted environments where inbound network discovery is blocked by firewalls, and (2) Devices that intermittently connect to the network (such as roaming employee laptops)."
  },
  {
    "source": "moreq.txt Q4",
    "category": "CMDB Health & Dashboards",
    "difficulty": "hard",
    "multiSelect": False,
    "question": "The CMDB Administrator group aims to display meaningful results on the CMDB Health Dashboard Compliance Scorecard for server records that are not on the latest patch. What must be configured to achieve this goal?",
    "options": [
      "Certification Filter, Certification Template, Audit",
      "Technical Service Offerings, Dynamic CI Groups, CMDB Groups",
      "Stale, Orphan, Duplicate",
      "Certification Policies, Data Filters, Scheduled Jobs"
    ],
    "correctIndices": [3],
    "explanation": "Compliance on the CMDB Health Dashboard is driven by Data Certification: Certification Policies (defining patch compliance checks), Data Filters (scoping to server classes), and Scheduled Jobs (automating regular compliance calculation runs)."
  },
  {
    "source": "moreq.txt Q5",
    "category": "Ingest & Integrations",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A CMDB Administrator has installed a Service Graph Connector and customized a script transform. What will happen on subsequent upgrades if the default definition of the script transform is updated?",
    "options": [
      "The upgrade stops and reports an error",
      "A skipped change is created and no change is made to the script transform definition",
      "The Service Graph Connector upgrade refuses to start",
      "The script transform is automatically overwritten"
    ],
    "correctIndices": [1],
    "explanation": "When a customer customizes a Service Graph Connector script transform, ServiceNow preserves customer logic during upgrades and logs a skipped change record in the Upgrade Monitor for review."
  },
  {
    "source": "moreq.txt Q6",
    "category": "CSDM & Lifecycle",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A customer's CMDB is aligned to the CSDM Walk stage. What benefit is provided by the CMDB?",
    "options": [
      "Allows for additional stratification of technical teams' support structure along the lines of OLAs and commitments",
      "Improves the implementation velocity of APM Foundation for future business application rationalization",
      "Enables impact assessments for incident, problem, and change on Business Services",
      "Automates microservice discovery in Kubernetes clusters"
    ],
    "correctIndices": [2],
    "explanation": "In the CSDM Walk stage, foundational Business Services and their relationships to underlying technical components are modeled. This enables automated impact assessments for Incident, Problem, and Change Management on Business Services."
  },
  {
    "source": "moreq.txt Q7",
    "category": "CMDB Health & Dashboards",
    "difficulty": "medium",
    "multiSelect": True,
    "question": "The Configuration Manager is preparing justification to utilize the CMDB Data Foundations Dashboard. Which benefits align with the usage of this dashboard? (Choose 2 options)",
    "options": [
      "It automates approval processes for Change Management",
      "It provides actionable insights to improve data quality and completeness",
      "It helps detect and eliminate duplicate records in the CMDB",
      "It enables monitoring and tracking of CMDB health over time"
    ],
    "correctIndices": [1, 3],
    "explanation": "The CMDB Data Foundations Dashboard provides actionable insights with guided Get Well Playbooks to improve data quality and completeness, and tracks CMDB health trends and CSDM maturity over time."
  },
  {
    "source": "moreq.txt Q8",
    "category": "CSDM & Lifecycle",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "The CMDB Configuration Management team has integrated discovered infrastructure data, accurately referenced non-discoverable data (support group info), and made the CMDB service-aware. Which field on an Incident form is automatically populated after a CI is selected that references an appropriate support group?",
    "options": [
      "Managed by Group",
      "Approval Group",
      "Assignment Group",
      "Change Group",
      "Support Group"
    ],
    "correctIndices": [2],
    "explanation": "When a CI with a populated Support Group is selected on an Incident record, ServiceNow automatically copies the Support Group value into the Incident's Assignment Group field for instant ticket routing."
  },
  {
    "source": "moreq.txt Q9",
    "category": "CMDB Health & Dashboards",
    "difficulty": "medium",
    "multiSelect": True,
    "question": "Configuration Management needs to ensure data quality for all CIs in the CMDB. What areas of data quality for CIs are included in the CMDB Health Dashboard? (Choose 2 options)",
    "options": [
      "Downgraded CIs",
      "Upgraded CIs",
      "Missing CIs",
      "Stale CIs",
      "Duplicate CIs"
    ],
    "correctIndices": [3, 4],
    "explanation": "Stale CIs (outdated records) and Duplicate CIs (multiple records for one asset) are two core data quality dimensions tracked under the Correctness KPI on the CMDB Health Dashboard."
  },
  {
    "source": "moreq.txt Q10",
    "category": "CMDB Health & Dashboards",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "A CMDB Manager wants to improve data quality using the CMDB Health Dashboard. What needs to happen to generate CMDB health scores?",
    "options": [
      "The scheduled jobs for the CMDB Health Dashboard must be activated",
      "Nothing, CMDB health scores are calculated by default",
      "The plugin, CMDB health calculation, needs to be installed",
      "Execute a daily manual export script"
    ],
    "correctIndices": [0],
    "explanation": "CMDB health scores are calculated asynchronously by background Scheduled Jobs (e.g. CMDB Health Dashboard - Correctness Score Calculation). These jobs must be activated and run to generate dashboard metrics."
  },
  {
    "source": "moreq.txt Q11",
    "category": "CMDB Data Manager & Governance",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A Configuration Manager needs to leverage a policy type to automate the creation and assignment of tasks to validate the existence of CIs. Which policy type should be used to accomplish this goal?",
    "options": [
      "Certification",
      "Delete",
      "Retire",
      "Attestation"
    ],
    "correctIndices": [3],
    "explanation": "Attestation policies in CMDB Data Manager specifically automate assigning verification tasks to CI owners to acknowledge whether physical or logical CIs still exist."
  },
  {
    "source": "moreq.txt Q12",
    "category": "CSDM & Lifecycle",
    "difficulty": "hard",
    "multiSelect": False,
    "question": "In a company, different stakeholders listed several use cases they expect over time. Which use case requires Information Objects in CSDM?",
    "options": [
      "The Asset Management team wants to understand asset lifecycle compliance in a Business Application context",
      "The Event Operations team wants to automate their events into incidents for operational actions",
      "The Customer Service team wants to onboard proactive case management",
      "The SecOps team wants to understand the operational risk in the Business Application context",
      "The Business Service Management team wants to understand the operational impact for consumer parties"
    ],
    "correctIndices": [0],
    "explanation": "Information Objects in CSDM represent logical data entities and governance classifications (such as asset lifecycle compliance, regulated data, or privacy data) associated with Business Applications without converting non-operational data into CIs."
  },
  {
    "source": "moreq.txt Q13",
    "category": "CMDB Data Manager & Governance",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "What is the difference between Data Certification and Attestation policies when managing a CI?",
    "options": [
      "Attestation requires correcting specific attributes of a CI, while Data Certification tracks acknowledgement the CI still exists",
      "Attestation can be scheduled, while Data Certification cannot be scheduled",
      "Attestation can be assigned to a group or an individual, while Data Certification can only be assigned to an individual",
      "Attestation tracks acknowledgement the CI still exists, while Data Certification requires validating specific attributes of a CI"
    ],
    "correctIndices": [3],
    "explanation": "Attestation confirms high-level CI existence and ownership (Yes/No acknowledgement), whereas Data Certification requires certifying and validating specific attribute values on the CI record."
  },
  {
    "source": "moreq.txt Q14",
    "category": "CMDB Data Manager & Governance",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "CMDB class owners are receiving tasks under the 'My Work' tab in the CMDB Workspace. Which CMDB management tool is generating those tasks?",
    "options": [
      "De-duplication templates",
      "CMDB Data Manager",
      "CMDB Health Dashboard",
      "Service Graph Connectors"
    ],
    "correctIndices": [1],
    "explanation": "CMDB Data Manager generates actionable governance tasks (attestation, certification, retirement, archival) and assigns them to class owners to manage under the 'My Work' tab in CMDB Workspace."
  },
  {
    "source": "moreq.txt Q15",
    "category": "Ingest & Integrations",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A CMDB Administrator needs to import external data into the CMDB. To reduce the risk of creating duplicates and prevent updates from unauthorized sources, it must be ensured that the Identification and Reconciliation Engine (IRE) is not bypassed. What is the recommended method?",
    "options": [
      "IntegrationHub ETL",
      "Table API (REST API or SOAP API)",
      "Import Sets and Transform Maps",
      "Direct database load"
    ],
    "correctIndices": [0],
    "explanation": "IntegrationHub ETL is natively built to process incoming third-party data through the Identification and Reconciliation API, preventing duplicates and enforcing reconciliation precedence."
  },
  {
    "source": "moreq.txt Q16",
    "category": "CSDM & Lifecycle",
    "difficulty": "medium",
    "multiSelect": True,
    "question": "A CMDB Administrator has built a number of Technology Management Service Offerings (Technical Service Offerings) based on Dynamic CI Groups. Which groups are synced to CIs from the offering? (Choose 2 options)",
    "options": [
      "Approval Group",
      "Managed by Group",
      "Owned by Group",
      "Support Group"
    ],
    "correctIndices": [1, 3],
    "explanation": "The CSDM group sync business rule automatically synchronizes 'Managed by Group' and 'Support Group' (as well as Change Group) from Technical Service Offerings to member CIs in Dynamic CI Groups."
  },
  {
    "source": "moreq.txt Q17",
    "category": "CMDB Data Manager & Governance",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "Which is a primary purpose or requirement of CMDB Data Manager in ServiceNow?",
    "options": [
      "Encrypts archived records for enhanced security",
      "Automates the enforcement of relationship rules between CIs in the CMDB",
      "Automates the archival and deletion of records based on retention policies",
      "Replaces Discovery pattern execution"
    ],
    "correctIndices": [2],
    "explanation": "CMDB Data Manager governs CI lifecycle data by automating the retirement, archival, and deletion of obsolete records based on defined retention policies."
  },
  {
    "source": "moreq.txt Q18",
    "category": "CSDM & Lifecycle",
    "difficulty": "medium",
    "multiSelect": False,
    "question": "A CMDB Administrator needs to identify which attributes have been created specifically for the Windows Server class. Which tab in the Attributes section is used?",
    "options": [
      "Child",
      "Added",
      "All",
      "Derived"
    ],
    "correctIndices": [1],
    "explanation": "The 'Added' tab in CI Class Manager displays attributes created directly on that specific class, distinguishing them from inherited parent attributes."
  },
  {
    "source": "moreq.txt Q19",
    "category": "IRE & Reconciliation",
    "difficulty": "hard",
    "multiSelect": False,
    "question": "A CMDB Administrator identifies duplicate CIs. One was created by a manual import (accurate business app relationship), and the other by automated discovery (latest IP address). How does the Administrator use Duplicate CI Remediator to resolve this?",
    "options": [
      "Merge the two CIs automatically, retaining all attributes from the discovered CI",
      "Retain the manually imported CI and delete the discovered CI",
      "Retain the discovered CI, but merge the relationship from the manually imported CI",
      "Retain the discovered CI and delete the manually imported CI"
    ],
    "correctIndices": [2],
    "explanation": "Retaining the discovered CI preserves accurate technical discovery attributes (IP, OS), while merging the relationship from the manual CI retains crucial business context and CSDM alignment."
  },
  {
    "source": "moreq.txt Q20",
    "category": "CMDB Data Manager & Governance",
    "difficulty": "easy",
    "multiSelect": False,
    "question": "What ensures data volume in the CMDB is manageable by removing or archiving outdated records according to retention schedules?",
    "options": [
      "Business Rules",
      "Scheduled Jobs",
      "Archive Policies",
      "Client Scripts"
    ],
    "correctIndices": [2],
    "explanation": "Archive Policies define lifecycle criteria to move obsolete CI records into archive tables, maintaining optimal CMDB performance and manageable data volume."
  }
]

# Read original base questions (125 Qs)
with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'r') as f:
    existing = json.load(f)

# Keep the base 125 questions from the 2 PDFs
base_125 = [q for q in existing if not q.get('source', '').startswith('moreq.txt')]

# Append ALL 20 questions from moreq.txt
combined = base_125 + moreq_questions

for idx, q in enumerate(combined, start=1):
    q["id"] = idx

with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'w') as f:
    json.dump(combined, f, indent=2)

multi_cnt = sum(1 for q in combined if q.get('multiSelect'))
print(f"Total questions now: {len(combined)} (Base: {len(base_125)}, moreq.txt: {len(moreq_questions)})")
print(f"Multi-select questions: {multi_cnt}")
