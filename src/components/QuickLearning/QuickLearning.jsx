import { useState } from 'react';
import styles from './QuickLearning.module.css';
import { useQuiz } from '../../context/QuizContext';

export default function QuickLearning() {
  const { startQuiz, goHome } = useQuiz();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const csdmStages = [
    {
      stage: 'Foundation Stage',
      badge: 'Step 1',
      icon: '🏗️',
      color: '#6c8fff',
      desc: 'Set up core foundational data without relationships.',
      items: ['Locations (cmn_location)', 'Groups (sys_user_group)', 'Companies (core_company)', 'Product Models (cmdb_model)', 'Departments & Business Units']
    },
    {
      stage: 'Crawl Stage',
      badge: 'Step 2',
      icon: '🌱',
      color: '#1db954',
      desc: 'Focus on basic application and service modeling.',
      items: ['Business Applications (cmdb_ci_business_app)', 'Application Services (cmdb_ci_service_discovered / cmdb_ci_service_auto)', 'Basic manual or discovered mappings']
    },
    {
      stage: 'Walk Stage',
      badge: 'Step 3',
      icon: '🚶',
      color: '#f69c08',
      desc: 'Implement operational technology services and group alignment.',
      items: ['Technical Services & Offerings', 'Dynamic CI Groups (cmdb_ci_query_based_service)', 'Sync Support Group, Change Group & Managed by Group']
    },
    {
      stage: 'Run Stage',
      badge: 'Step 4',
      icon: '🏃',
      color: '#a435f0',
      desc: 'Connect business services to underlying technical offerings.',
      items: ['Business Services & Service Offerings', 'Service Portfolio management', 'Full ITSM integration (Incident, Change, Problem routing)']
    },
    {
      stage: 'Fly Stage',
      badge: 'Step 5',
      icon: '🚀',
      color: '#e74c3c',
      desc: 'Expand with enterprise architecture, capabilities, and governance.',
      items: ['Business Capabilities (cmdb_ci_business_capability)', 'Information Objects (data privacy/regulations)', 'AI & Digital Assets governance', 'Vulnerability & Risk Scoping']
    }
  ];

  const domains = [
    {
      name: 'Foundation Domain',
      icon: '🏛️',
      ownership: 'Process Owner, Product Owner, Contract Manager',
      tables: ['cmdb_model', 'cmn_location', 'cmdb_group', 'core_company', 'cmn_department', 'business_unit'],
      purpose: 'Core referential data that is referenced across all CMDB classes and ITSM processes (locations, product models, companies, departments).',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/foundation-domain.html'
    },
    {
      name: 'Ideation & Strategy Domain',
      icon: '💡',
      ownership: 'Product Owner, Portfolio Manager',
      tables: ['sn_align_core_product_idea', 'sn_gf_goal'],
      purpose: 'Strategic planning, enterprise goals, demands, and product idea alignment before technical design.',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/design-domain.html'
    },
    {
      name: 'Design & Planning Domain',
      icon: '📐',
      ownership: 'Enterprise Architect, Digital Product Owner',
      tables: ['cmdb_ci_business_app', 'cmdb_ci_business_capability', 'cmdb_ci_information_object'],
      purpose: 'Conceptual enterprise architecture defining what the business does and the conceptual business applications used to deliver capabilities.',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/design-domain.html'
    },
    {
      name: 'Build & Integration Domain',
      icon: '⚙️',
      ownership: 'DevOps Teams, Engineering Leads',
      tables: ['cmdb_ci_sdlc_component', 'dm_ai_system_digital_asset'],
      purpose: 'Software Development Lifecycle (SDLC) components, build pipelines, repositories, and AI digital asset management.',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/manage-technical-services-domain.html'
    },
    {
      name: 'Service Delivery Domain (Manage Technical Services)',
      icon: '🖥️',
      ownership: 'Service Provider, Service Delivery Owner, Service Instance Owner',
      tables: ['cmdb_ci_service_auto', 'cmdb_ci_network_service_instance', 'cmdb_ci_query_based_service'],
      purpose: 'Operational, runtime entities that IT teams manage and support (Application Services, Infrastructure Services, Dynamic CI Groups).',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/manage-technical-services-domain.html'
    },
    {
      name: 'Service Consumption Domain (Sell/Consume)',
      icon: '🤝',
      ownership: 'Business Relationship Manager, Customer Service Manager',
      tables: ['cmdb_ci_service_business', 'service_offering'],
      purpose: 'Business services and offerings presented to end-users and customers representing commitment tiers, SLAs, and pricing.',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/foundation-domain.html'
    },
    {
      name: 'Manage Portfolio Domain',
      icon: '📂',
      ownership: 'Service Portfolio Owner, Executive Leadership',
      tables: ['service_portfolio'],
      purpose: 'High-level aggregation of services into portfolios for financial planning, executive visibility, and strategic management.',
      docRef: 'https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/foundation-domain.html'
    }
  ];

  const relationships = [
    {
      parent: 'Application Service',
      relationship: 'Depends on :: Used by',
      child: 'Host Server (Windows / Linux)',
      example: 'SAP Production (Application Service) Depends on :: Used by SAP-APP01 (Server)',
      rule: 'Top-down operational relationship.'
    },
    {
      parent: 'Software Process / DB Instance',
      relationship: 'Runs on :: Runs',
      child: 'Server Host',
      example: 'Oracle DB Instance (Child) Runs on :: Runs Oracle-Host01 (Parent)',
      rule: 'Software component executing on a host machine.'
    },
    {
      parent: 'Business Application',
      relationship: 'Consumes :: Consumed by',
      child: 'Application Service / Business Service',
      example: 'Workday HR (Business App) Consumes :: Consumed by Workday Prod (Application Service)',
      rule: 'Connects conceptual architecture to operational runtime.'
    },
    {
      parent: 'Application Service',
      relationship: 'Used by :: Uses',
      child: 'Underlying Infrastructure CIs',
      example: 'Technical Services utilized by end-to-end applications.',
      rule: 'Dependency traversal in Unified Map and Service Mapping.'
    }
  ];

  const dashboardTabs = [
    {
      tab: 'Customization',
      icon: '🛠️',
      color: '#ff7043',
      visibility: 'Monitors custom tables and custom schema modifications.',
      practices: [
        'Identifies custom business application tables (e.g. u_ tables)',
        'Monitors unconventional custom tables and columns',
        'Tracks custom CMDB relationship types created outside standard model',
        'Detects modifications to out-of-box relationship types to prevent upgrade issues'
      ]
    },
    {
      tab: 'Data Management',
      icon: '🧹',
      color: '#a435f0',
      visibility: 'Tracks IRE adoption, duplicates, naming, and data hygiene.',
      practices: [
        'Monitors CIs not processed via Identification and Reconciliation Engine (IRE)',
        'Identifies unhandled duplicate CIs needing remediation',
        'Highlights CIs missing mandatory Name attributes',
        'Tracks active CIs not updated within the last 90 days (Staleness)',
        'Identifies managed CIs missing model/manufacturer entries'
      ]
    },
    {
      tab: 'Best Practices (Hardware / Serial Numbers)',
      icon: '🛡️',
      color: '#1db954',
      visibility: 'Validates key hardware identifiers and ownership completeness.',
      practices: [
        'Tracks hardware CIs missing Serial Numbers (critical identifier attribute)',
        'Monitors key class information across Server, Network Gear, and Storage',
        'Highlights Services and CIs missing designated owners (Owned by / Managed by)',
        'Provides guided Get Well Playbooks for step-by-step remediation'
      ]
    },
    {
      tab: 'ITSM Processes',
      icon: '📋',
      color: '#61dafb',
      visibility: 'Measures CMDB utilization in operational Incident and Change workflows.',
      practices: [
        'Monitors CIs referenced in active Incidents',
        'Tracks CIs linked to Change Requests and Change impact analysis',
        'Verifies Principal Class filter adoption in ITSM lookup fields'
      ]
    }
  ];

  // Filtering
  const filterMatches = (text) => text.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>⚡ CIS-DF Quick Learning Cheat Sheet</div>
        <h1 className={styles.title}>
          Master Key <span className={styles.titleGradient}>CSDM & CMDB</span> Concepts
        </h1>
        <p className={styles.subtitle}>
          Your high-yield summary of CSDM Domains, 5-Stage Adoption Model, Relationship Pairs, CMDB Data Foundations Dashboard Tabs, and Exam Memorization Keys.
        </p>

        {/* Action button */}
        <div className={styles.headerActions}>
          <button className="btn btn-primary" onClick={() => startQuiz('full')}>
            🎯 Test Your Knowledge (125 Qs)
          </button>
          <button className="btn btn-secondary" onClick={goHome}>
            🏠 Back to Quizzes
          </button>
        </div>
      </header>

      {/* Navigation Filter Tabs */}
      <div className={styles.filterBar}>
        <div className={styles.tabList}>
          {[
            { id: 'all', label: '🌟 All Sections' },
            { id: 'csdm5-map', label: '🗺️ CSDM 5 Conceptual Map' },
            { id: 'stages', label: '🚀 CSDM 5 Stages' },
            { id: 'domains', label: '🏛️ CSDM 5 Domains' },
            { id: 'relationships', label: '🔗 CI Relationships' },
            { id: 'dashboards', label: '📊 Dashboard Tabs' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Filter concepts, tables, roles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button className={styles.clearBtn} onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      {/* ── SECTION: CSDM 5 CONCEPTUAL MODEL DIAGRAM IMAGE ─────────────── */}
      {(activeTab === 'all' || activeTab === 'csdm5-map') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🗺️</span>
            <div>
              <h2 className={styles.sectionTitle}>Figure 4: CSDM 5.0 Conceptual Model Architecture Diagram</h2>
              <p className={styles.sectionSub}>The official ServiceNow CSDM 5.0 architecture diagram showing all 7 domains, personas, and entity linkages.</p>
            </div>
          </div>

          <div className={styles.imageCard}>
            <div className={styles.imageToolbar}>
              <span className={styles.imageCaption}>📸 Official ServiceNow CSDM 5 Conceptual Model</span>
              <a href="/csdm5-model.png" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                🔍 Open Fullscreen Image
              </a>
            </div>
            <div className={styles.imageWrapper}>
              <img
                src="/csdm5-model.png"
                alt="CSDM 5.0 Conceptual Model Architecture Diagram"
                className={styles.csdmImage}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 1: CSDM 5 STAGES ────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'stages') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🚀</span>
            <div>
              <h2 className={styles.sectionTitle}>CSDM 5 Stages (Crawl → Walk → Run → Fly Approach)</h2>
              <p className={styles.sectionSub}>Sequential maturity journey to implement the Common Service Data Model.</p>
            </div>
          </div>

          <div className={styles.stagesGrid}>
            {csdmStages.filter(s => filterMatches(s.stage) || filterMatches(s.desc) || s.items.some(filterMatches)).map((s, idx) => (
              <div key={idx} className={styles.stageCard} style={{ borderTopColor: s.color }}>
                <div className={styles.stageTop}>
                  <span className={styles.stageIcon}>{s.icon}</span>
                  <span className={styles.stageBadge} style={{ background: `${s.color}20`, color: s.color }}>
                    {s.badge}
                  </span>
                </div>
                <h3 className={styles.stageName}>{s.stage}</h3>
                <p className={styles.stageDesc}>{s.desc}</p>
                <div className={styles.stageItems}>
                  <div className={styles.stageItemsTitle}>Key Focus Areas:</div>
                  <ul>
                    {s.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION 2: CSDM DOMAINS & ROLES ────────────────── */}
      {(activeTab === 'all' || activeTab === 'domains') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🏛️</span>
            <div>
              <h2 className={styles.sectionTitle}>CSDM Domains, Ownership, Key Tables & Purpose</h2>
              <p className={styles.sectionSub}>Memorize who owns which domain, the underlying database tables, and the business purpose.</p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.domainTable}>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Primary Persona & Ownership</th>
                  <th>Key Tables</th>
                  <th>Core Purpose</th>
                </tr>
              </thead>
              <tbody>
                {domains
                  .filter(d => filterMatches(d.name) || filterMatches(d.ownership) || filterMatches(d.purpose) || d.tables.some(filterMatches))
                  .map((d, idx) => (
                    <tr key={idx}>
                      <td className={styles.domainNameCell}>
                        <span className={styles.cellIcon}>{d.icon}</span>
                        <strong>{d.name}</strong>
                      </td>
                      <td className={styles.ownershipCell}>
                        <span className={styles.personaTag}>{d.ownership}</span>
                      </td>
                      <td>
                        <div className={styles.tableTags}>
                          {d.tables.map((tbl, i) => (
                            <code key={i} className={styles.tableCode}>{tbl}</code>
                          ))}
                        </div>
                      </td>
                      <td className={styles.purposeCell}>
                        {d.purpose}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── SECTION 3: CI RELATIONSHIP TYPE PAIRS ───────────── */}
      {(activeTab === 'all' || activeTab === 'relationships') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🔗</span>
            <div>
              <h2 className={styles.sectionTitle}>Key CI Relationship Type Pairs in the CMDB</h2>
              <p className={styles.sectionSub}>Parent :: Child relationship conventions used by Service Mapping, Discovery, and IRE.</p>
            </div>
          </div>

          <div className={styles.relationshipGrid}>
            {relationships
              .filter(r => filterMatches(r.parent) || filterMatches(r.relationship) || filterMatches(r.child) || filterMatches(r.example))
              .map((rel, idx) => (
                <div key={idx} className={styles.relCard}>
                  <div className={styles.relHeader}>
                    <span className={styles.relTypeBadge}>{rel.relationship}</span>
                  </div>
                  <div className={styles.relDiagram}>
                    <div className={styles.relNode}>{rel.parent}</div>
                    <div className={styles.relArrow}>──▶</div>
                    <div className={styles.relNode}>{rel.child}</div>
                  </div>
                  <div className={styles.relExample}>
                    <strong>Example:</strong> {rel.example}
                  </div>
                  <div className={styles.relRule}>
                    💡 {rel.rule}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ── SECTION 4: CMDB DATA FOUNDATIONS DASHBOARD TABS ── */}
      {(activeTab === 'all' || activeTab === 'dashboards') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📊</span>
            <div>
              <h2 className={styles.sectionTitle}>CMDB Data Foundations Dashboard Tabs & Best Practices</h2>
              <p className={styles.sectionSub}>Detailed view of each tab, visibility scope, and remediation expectations.</p>
            </div>
          </div>

          <div className={styles.dashGrid}>
            {dashboardTabs
              .filter(t => filterMatches(t.tab) || filterMatches(t.visibility) || t.practices.some(filterMatches))
              .map((tab, idx) => (
                <div key={idx} className={styles.dashCard} style={{ borderLeftColor: tab.color }}>
                  <div className={styles.dashTop}>
                    <span className={styles.dashIcon}>{tab.icon}</span>
                    <h3 className={styles.dashTabTitle}>{tab.tab} Tab</h3>
                  </div>
                  <div className={styles.dashVisibility}>
                    <strong>Scope & Visibility:</strong> {tab.visibility}
                  </div>
                  <div className={styles.dashPractices}>
                    <strong>Best Practices Checked:</strong>
                    <ul>
                      {tab.practices.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Bottom Call to Action */}
      <div className={styles.bottomCta}>
        <div className={styles.ctaIcon}>🎓</div>
        <div>
          <h3 className={styles.ctaTitle}>Ready to ace the CIS-Data Foundations Exam?</h3>
          <p className={styles.ctaDesc}>Put these concepts into practice with 125 curated exam questions covering all 6 domains.</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => startQuiz('full')}>
          🚀 Launch Practice Exam
        </button>
      </div>
    </div>
  );
}
