import { useState, useCallback, useMemo } from 'react';

const DATA_TYPES = [
  { id: 'email', label: '📧 Email addresses' },
  { id: 'name', label: '👤 Full names' },
  { id: 'phone', label: '📞 Phone numbers' },
  { id: 'address', label: '🏠 Physical addresses' },
  { id: 'payment', label: '💳 Payment information' },
  { id: 'analytics', label: '📊 Usage data & analytics (Google Analytics etc.)' },
  { id: 'cookies', label: '🍪 Cookies' },
  { id: 'ip', label: '🌐 IP addresses' },
  { id: 'device', label: '📱 Device information' },
  { id: 'location', label: '📍 Location data' },
];

const JURISDICTIONS = [
  'United States', 'European Union (GDPR)', 'United Kingdom', 'Canada (PIPEDA)',
  'Australia', 'India', 'Brazil (LGPD)', 'California (CCPA)', 'Other',
];

function generatePrivacyPolicy(form) {
  const { company, website, email, jurisdiction, date, dataTypes } = form;
  const collectedItems = DATA_TYPES.filter(d => dataTypes.includes(d.id));
  const collectedList = collectedItems.map(d => d.label.replace(/^[\S]+\s/, '')).join(', ');
  const hasAnalytics = dataTypes.includes('analytics');
  const hasCookies = dataTypes.includes('cookies');
  const hasPayment = dataTypes.includes('payment');
  const hasLocation = dataTypes.includes('location');
  const isGDPR = jurisdiction.includes('EU') || jurisdiction.includes('GDPR') || jurisdiction.includes('UK');
  const isCCPA = jurisdiction.includes('California') || jurisdiction.includes('CCPA') || jurisdiction.includes('United States');

  return `PRIVACY POLICY
${company}
Last Updated: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. INTRODUCTION

Welcome to ${company} ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ${website} and use our services.

Please read this Privacy Policy carefully. If you disagree with its terms, please discontinue use of our site. This policy applies to all information collected through our website and any related services, sales, marketing, or events.

2. INFORMATION WE COLLECT

We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third-party sources.

${collectedList ? `2.1 Personal Information You Provide

We may collect the following categories of personal information:
${collectedItems.map(d => `  • ${d.label.replace(/^[\S]+\s/, '')}`).join('\n')}

This information is collected when you register for an account, make a purchase, subscribe to our newsletter, fill out a form, or otherwise interact with our services.` : '2.1 We collect minimal personal information necessary to provide our services.'}

2.2 Automatically Collected Information

When you visit ${website}, our servers automatically record certain information your browser sends whenever you visit a website. This may include${dataTypes.includes('ip') ? ' your IP address,' : ''}${dataTypes.includes('device') ? ' browser type and version, operating system, device identifiers,' : ''} referring/exit pages, date/time stamps, and clickstream data.

${hasCookies ? `2.3 Cookies and Tracking Technologies

We use cookies, web beacons, and similar tracking technologies to collect and store information about your preferences and to help us improve ${company}'s services. Cookies are small data files placed on your device when you visit our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.

Types of cookies we use:
  • Essential Cookies: Required for the operation of our website. These include session management and security features.
  • Preference Cookies: Enable our website to remember choices you make (such as language preferences) and provide enhanced, personalized features.
  • Analytics Cookies: Allow us to recognize and count visitors and to understand how visitors move around our website to improve functionality.
  • Marketing Cookies: Used to track visitors across websites to display relevant advertisements.` : ''}

${hasAnalytics ? `2.4 Analytics

We use third-party analytics services such as Google Analytics to collect information about how you use ${website}. These services collect information sent by your browser as part of a web page request, including cookies and your IP address. Google Analytics collects only the IP address assigned to you on the date you visit this site, not your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information. Although Google Analytics plants a permanent cookie on your web browser to identify you as a unique user, the cookie cannot be used by anyone but Google. Google's ability to use and share information collected by Google Analytics about your visits to this site is restricted by the Google Analytics Terms of Use and the Google Privacy Policy.` : ''}

3. HOW WE USE YOUR INFORMATION

We use the information we collect for the following purposes:

  • To provide, operate, and maintain our services and website
  • To process transactions and send you related information, including purchase confirmations and invoices
  • To send administrative information, such as changes to our terms, conditions, and policies
  • To respond to your comments and questions and provide customer service
  • To send you technical notices, updates, and security alerts
  • To monitor and analyze usage patterns and trends to improve user experience
  • To detect, investigate, and prevent fraudulent transactions and other illegal activities
  • To comply with legal obligations and enforce our terms of service
${hasPayment ? '  • To process payments and prevent fraudulent transactions' : ''}
${hasLocation ? '  • To provide location-based services and customized content based on your location' : ''}

4. SHARING YOUR INFORMATION

We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this Privacy Policy. We may share your information in the following circumstances:

4.1 Service Providers

We may share your information with third-party vendors, service providers, contractors, or agents who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. These third parties are contractually obligated to keep your information confidential and use it only for the purposes for which we disclose it to them.

4.2 Business Transfers

We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.

4.3 Legal Requirements

We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal processes. We may also disclose your information to protect the rights, property, or safety of ${company}, our customers, or others.

4.4 With Your Consent

We may disclose your personal information for any other purpose with your consent.

${hasPayment ? `5. PAYMENT INFORMATION

All payment transactions are encrypted using SSL technology. We do not store complete credit card numbers on our servers. Payments are processed through third-party payment processors who are PCI-DSS compliant. ${company} has no control over and assumes no responsibility for the content, privacy policies, or practices of any payment processor's sites or services.` : ''}

${isGDPR ? `${hasPayment ? '6' : '5'}. YOUR RIGHTS UNDER GDPR / DATA SUBJECT RIGHTS

If you are a resident of the European Economic Area (EEA) or the United Kingdom, you have certain data protection rights. ${company} aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.

You have the following rights:

  • Right of Access: You have the right to request copies of your personal data. We may charge you a small fee for this service.
  • Right to Rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
  • Right to Erasure: You have the right to request that we erase your personal data, under certain conditions.
  • Right to Restrict Processing: You have the right to request that we restrict the processing of your personal data, under certain conditions.
  • Right to Data Portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
  • Right to Object: You have the right to object to our processing of your personal data, under certain conditions.

To exercise any of these rights, please contact us at ${email}. We will respond to your request within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with your local supervisory authority.

Legal Basis for Processing: We process your personal data under the following legal bases as defined by GDPR: (a) your consent; (b) the performance of a contract to which you are a party; (c) compliance with a legal obligation; (d) our legitimate interests, provided those interests are not overridden by your rights and interests.` : ''}

${isCCPA && !isGDPR ? `${hasPayment ? '6' : '5'}. CALIFORNIA CONSUMER PRIVACY ACT (CCPA) RIGHTS

If you are a California resident, you have the following rights under the CCPA:

  • Right to Know: You have the right to request that ${company} disclose the categories and specific pieces of personal information we have collected about you, the categories of sources from which we collect personal information, our purposes for collecting personal information, the categories of third parties with whom we share personal information, and the specific pieces of personal information we have collected about you.
  • Right to Delete: You have the right to request that we delete personal information we have collected from you, subject to certain exceptions.
  • Right to Non-Discrimination: We will not discriminate against you for exercising any of your CCPA rights.
  • Right to Opt-Out of Sale: We do not sell your personal information. However, if this practice changes, you will have the right to opt out.

To exercise your CCPA rights, please contact us at ${email}. We will verify your request and respond within 45 days.` : ''}

${(isGDPR || isCCPA) ? '' : `5. YOUR CHOICES AND RIGHTS

You have the following rights regarding your personal information:

  • Access and Correction: You may access, update, or delete your personal information by contacting us at ${email}.
  • Marketing Communications: You may opt-out of receiving promotional communications from us by following the unsubscribe link in any email or by contacting us directly.
  • Do Not Track: Some browsers include a "Do Not Track" feature. We currently do not respond to these signals.`}

6. DATA RETENTION

We retain personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need personal information, we securely delete or anonymize it. Specifically:

  • Account information is retained for the duration of your account plus 2 years after closure
  • Transaction records are retained for 7 years for accounting and legal compliance purposes
  • Communication logs are retained for 3 years
  • Analytics data is retained in aggregated, anonymized form indefinitely

7. SECURITY OF YOUR INFORMATION

We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:

  • SSL/TLS encryption for data in transit
  • Encryption of sensitive data at rest
  • Regular security assessments and penetration testing
  • Access controls and authentication requirements for our systems
  • Employee training on data privacy and security best practices

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. In the event of a data breach, we will notify affected users in accordance with applicable law.

8. THIRD-PARTY WEBSITES AND LINKS

Our website may contain links to third-party websites, applications, and services that are not owned or controlled by ${company}. We are not responsible for the privacy practices, content, or security of any third-party services. We encourage you to review the privacy policies of any third-party services you visit.

9. CHILDREN'S PRIVACY

Our services are not directed to individuals under the age of 13 (or 16 in the European Union). We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at ${email}. If we discover that a child under 13 has provided us with personal information, we will delete it promptly.

10. INTERNATIONAL DATA TRANSFERS

Your information, including personal data, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. ${isGDPR ? 'We ensure that such transfers comply with the requirements of GDPR, including the use of Standard Contractual Clauses (SCCs) or other appropriate safeguards.' : 'By using our services, you consent to such transfers.'}

11. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the "Last Updated" date at the top of this policy and, where appropriate, by sending you an email notification. We encourage you to review this Privacy Policy periodically.

Your continued use of ${website} after any changes to this Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide by the updated policy.

12. CONTACT US

If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

  ${company}
  Website: ${website}
  Email: ${email}
  Jurisdiction: ${jurisdiction}

We will respond to your inquiry within 30 days.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This document was generated by DevTools Hub on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
`;
}

function generateTermsOfService(form) {
  const { company, website, email, jurisdiction, date } = form;

  return `TERMS OF SERVICE
${company}
Effective Date: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AGREEMENT TO TERMS

These Terms of Service ("Terms") constitute a legally binding agreement between you and ${company} ("Company," "we," "us," or "our") concerning your access to and use of the ${website} website and any related services (collectively, the "Services").

BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ACCESS OR USE OUR SERVICES.

1. USE OF SERVICES

1.1 Eligibility

You must be at least 18 years of age to use our Services. By using our Services, you represent and warrant that you meet this eligibility requirement. If you are under 18, you may only use the Services with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms.

1.2 License

Subject to your compliance with these Terms, ${company} grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Services for your personal or internal business purposes.

1.3 Restrictions

You agree not to:
  • Use the Services for any unlawful purpose or in violation of any applicable regulations
  • Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services without our express written permission
  • Attempt to gain unauthorized access to any portion of the Services or its related systems
  • Interfere with or disrupt the integrity or performance of the Services
  • Upload or transmit viruses, malware, or other malicious code
  • Collect or harvest any personally identifiable information from the Services
  • Use the Services to send unsolicited communications (spam)
  • Impersonate any person or entity, or misrepresent your affiliation with any person or entity

2. INTELLECTUAL PROPERTY

2.1 Our Intellectual Property

The Services and their original content, features, functionality, logos, trademarks, and trade names are owned by ${company} and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not use our intellectual property without our prior written consent.

2.2 Your Content

You retain ownership of any content you submit, post, or display on or through the Services ("Your Content"). By submitting Your Content, you grant ${company} a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform Your Content in connection with the Services.

You represent and warrant that Your Content does not violate the rights of any third party, including copyright, trademark, privacy, or other personal or proprietary rights.

3. PAYMENT TERMS

If any part of the Services is offered on a paid basis, the following terms apply:

  • All fees are stated in the applicable currency and are non-refundable except as expressly set forth in these Terms
  • You authorize us to charge your payment method on file for all applicable fees
  • We reserve the right to modify our pricing at any time. We will provide notice of any price changes before they take effect
  • If your payment fails, we reserve the right to suspend or terminate your access to paid features
  • All prices are exclusive of taxes, levies, or duties, which you are responsible for paying

4. DISCLAIMERS AND LIMITATION OF LIABILITY

4.1 Disclaimer of Warranties

THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ${company.toUpperCase()} DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.

4.2 Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ${company.toUpperCase()} AND ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
  • YOUR USE OR INABILITY TO USE THE SERVICES
  • ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN
  • ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES
  • ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD PARTY

IN NO EVENT SHALL ${company.toUpperCase()}'S AGGREGATE LIABILITY TO YOU EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO ${company.toUpperCase()} IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100.00).

5. INDEMNIFICATION

You agree to defend, indemnify, and hold harmless ${company} and its licensees, licensors, employees, contractors, agents, officers, and directors from and against any claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from:
  (a) your use of and access to the Services;
  (b) your violation of any term of these Terms;
  (c) your violation of any third-party right, including any copyright, property, or privacy right; or
  (d) any claim that Your Content caused damage to a third party.

6. TERMINATION

We reserve the right to terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, third parties, or for any other reason.

Upon termination, your right to use the Services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

7. GOVERNING LAW AND DISPUTE RESOLUTION

These Terms shall be governed by and construed in accordance with the laws of ${jurisdiction}, without regard to its conflict of law provisions.

Any disputes arising under or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration body in ${jurisdiction}, rather than in court. You agree to waive your right to a trial by jury or to participate in a class action.

Notwithstanding the foregoing, ${company} may seek injunctive or other equitable relief in any court of competent jurisdiction.

8. CHANGES TO TERMS

We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the effective date at the top of these Terms and, where appropriate, notifying you via email. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.

9. MISCELLANEOUS

9.1 Entire Agreement: These Terms, together with our Privacy Policy and any other legal notices published by us on the Services, shall constitute the entire agreement between you and ${company} concerning the Services.

9.2 Severability: If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.

9.3 Waiver: Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

9.4 Assignment: You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.

10. CONTACT INFORMATION

If you have any questions about these Terms, please contact us:

  ${company}
  Website: ${website}
  Email: ${email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This document was generated by DevTools Hub on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
`;
}

export default function PrivacyPolicyGenerator({ copyToClipboard, showToast }) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    company: '',
    website: '',
    email: '',
    jurisdiction: 'United States',
    date: today,
    dataTypes: ['email', 'cookies', 'analytics', 'ip'],
  });
  const [activeTab, setActiveTab] = useState('privacy');
  const [generated, setGenerated] = useState('');
  const [generatedType, setGeneratedType] = useState('');

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleDataType = (id) => {
    setForm((prev) => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(id)
        ? prev.dataTypes.filter((d) => d !== id)
        : [...prev.dataTypes, id],
    }));
  };

  const isFormValid = form.company && form.website && form.email;

  const handleGenerate = useCallback(() => {
    if (!isFormValid) {
      showToast?.('⚠️ Please fill in Company Name, Website URL, and Contact Email');
      return;
    }
    const text = activeTab === 'privacy'
      ? generatePrivacyPolicy(form)
      : generateTermsOfService(form);
    setGenerated(text);
    setGeneratedType(activeTab);
    showToast?.(`✅ ${activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} generated!`);
    setTimeout(() => {
      document.getElementById('pp-output-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [form, activeTab, isFormValid, showToast]);

  const handleCopy = useCallback(() => {
    if (!generated) return;
    copyToClipboard?.(generated);
    showToast?.('📋 Document copied to clipboard!');
  }, [generated, copyToClipboard, showToast]);

  const handleDownload = useCallback(() => {
    if (!generated) return;
    const blob = new Blob([generated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = generatedType === 'privacy'
      ? `${form.company.toLowerCase().replace(/\s+/g, '-')}-privacy-policy.txt`
      : `${form.company.toLowerCase().replace(/\s+/g, '-')}-terms-of-service.txt`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('⬇️ Download started!');
  }, [generated, generatedType, form.company, showToast]);

  const wordCount = useMemo(() => generated.split(/\s+/).filter(Boolean).length, [generated]);

  return (
    <div className="pane" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pane-header">
        <h2 className="pane-title">📜 Privacy Policy Generator</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Generate comprehensive, production-ready legal documents — fully client-side
        </p>
      </div>

      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Tabs */}
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            🔒 Privacy Policy
          </button>
          <button
            className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            📋 Terms of Service
          </button>
        </div>

        {/* Form */}
        <div className="split-pane" style={{ gap: '1rem' }}>

          {/* Company Name */}
          <div>
            <label className="input-label">🏢 Company / App Name <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input
              className="input-field"
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => updateForm('company', e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="input-label">🌐 Website URL <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input
              className="input-field"
              type="url"
              placeholder="https://yourwebsite.com"
              value={form.website}
              onChange={(e) => updateForm('website', e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="input-label">📧 Contact Email <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input
              className="input-field"
              type="email"
              placeholder="privacy@yourcompany.com"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="input-label">⚖️ Governing Jurisdiction</label>
            <select
              className="input-field"
              value={form.jurisdiction}
              onChange={(e) => updateForm('jurisdiction', e.target.value)}
              style={{ marginTop: '0.5rem', cursor: 'pointer' }}
            >
              {JURISDICTIONS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Effective Date */}
          <div>
            <label className="input-label">📅 Effective Date</label>
            <input
              className="input-field"
              type="date"
              value={form.date}
              onChange={(e) => updateForm('date', e.target.value)}
              style={{ marginTop: '0.5rem', colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Data Types — only for privacy policy */}
        {activeTab === 'privacy' && (
          <div>
            <label className="input-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              🗂️ What data do you collect?
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.5rem',
            }}>
              {DATA_TYPES.map(({ id, label }) => (
                <label
                  key={id}
                  htmlFor={`data-${id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '8px',
                    border: `1px solid ${form.dataTypes.includes(id) ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
                    background: form.dataTypes.includes(id) ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontSize: '0.85rem',
                    color: form.dataTypes.includes(id) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <input
                    id={`data-${id}`}
                    type="checkbox"
                    checked={form.dataTypes.includes(id)}
                    onChange={() => toggleDataType(id)}
                    style={{ accentColor: 'var(--accent-purple)', width: '15px', height: '15px' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Jurisdiction info banner */}
        {(form.jurisdiction.includes('EU') || form.jurisdiction.includes('GDPR') || form.jurisdiction.includes('UK')) && activeTab === 'privacy' && (
          <div style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid var(--accent-purple)',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}>
            🇪🇺 <strong>GDPR Mode:</strong> Your policy will include GDPR-specific sections including legal bases for processing, data subject rights, and right to lodge complaints with supervisory authorities.
          </div>
        )}
        {(form.jurisdiction.includes('California') || form.jurisdiction.includes('CCPA')) && activeTab === 'privacy' && (
          <div style={{
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}>
            🌴 <strong>CCPA Mode:</strong> Your policy will include California Consumer Privacy Act rights including right to know, right to delete, and right to opt-out of data sales.
          </div>
        )}

        {/* Generate Button */}
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={!isFormValid}
          style={{ alignSelf: 'flex-start', fontSize: '0.95rem', padding: '0.65rem 1.5rem' }}
        >
          ✨ Generate {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </button>

        {/* Output */}
        {generated && (
          <div id="pp-output-section">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {generatedType === 'privacy' ? '🔒 Privacy Policy' : '📋 Terms of Service'}
                </h3>
                <span style={{
                  background: 'var(--accent-cyan)',
                  color: '#000',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  padding: '0.1rem 0.45rem',
                  fontWeight: 700,
                }}>
                  ~{wordCount} words
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                  📋 Copy
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleDownload}>
                  ⬇️ Download .txt
                </button>
              </div>
            </div>
            <textarea
              className="textarea-code"
              readOnly
              value={generated}
              rows={24}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                lineHeight: 1.65,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />

            {/* Legal disclaimer */}
            <div style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid var(--accent-amber)',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '0.75rem',
            }}>
              ⚖️ <strong style={{ color: 'var(--accent-amber)' }}>Legal Disclaimer:</strong> This document is generated for informational purposes and provides a solid starting point. For complete legal compliance specific to your jurisdiction and business model, we recommend having the final document reviewed by a qualified attorney.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
