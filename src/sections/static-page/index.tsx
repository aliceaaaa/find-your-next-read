import { useParams } from 'react-router-dom';
import styles from './static-page.module.scss';

type StaticContent = {
  title: string;
  description: string;
  body: React.ReactNode[];
};

const CookiesTable = () => (
  <table className={styles.cookiesTable}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Provider</th>
        <th>Purpose</th>
        <th>Lifetime</th>
        <th>Category</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code>cookie_consent</code>
        </td>
        <td>findyournextread.com (first-party)</td>
        <td>Stores your cookie consent choice (which categories you accepted).</td>
        <td>12 months</td>
        <td>Necessary</td>
      </tr>
      <tr>
        <td>
          <code>device_id</code>
        </td>
        <td>findyournextread.com (first-party)</td>
        <td>
          Stores a pseudonymous identifier used to keep your consent record
          linked to your device.
        </td>
        <td>Persistent (until cleared)</td>
        <td>Necessary</td>
      </tr>
      <tr>
        <td>
          <code>_ga</code>
        </td>
        <td>Google LLC</td>
        <td>
          Distinguishes individual users. Used by Google Analytics 4 to compute
          visitor, session, and campaign counts.
        </td>
        <td>2 years</td>
        <td>Analytics</td>
      </tr>
      <tr>
        <td>
          <code>_ga_&lt;CONTAINER_ID&gt;</code>
        </td>
        <td>Google LLC</td>
        <td>
          Maintains session state for Google Analytics 4. The placeholder in the
          cookie name is the GA4 measurement ID.
        </td>
        <td>2 years</td>
        <td>Analytics</td>
      </tr>
    </tbody>
  </table>
);

const PAGES: Record<string, StaticContent> = {
  about: {
    title: 'About',
    description: 'What Find your next read is and who it is for.',
    body: [
      <h1>Impressum</h1>,
      <h2> Impressum / Legal Notice </h2>,
      'Information pursuant to § 5 DDG (Digitale-Dienste-Gesetz)',
      'Website Operator / Service Provider:',
      'Nikolai Surovegin',
      'Braunstr. 21',
      '24145, Kiel, Germany',
      'Contact Information:',
      <>Email: <a href="mailto:infawn@gmail.com">infawn@gmail.com</a></>,
      <h2>Responsible for content pursuant to § 18 (2) Medienstaatsvertrag (MStV)</h2>,
      'Nikolai Surovegin',
      'Braunstr. 21',
      '24145 Kiel, Germany',
      <>Email: <a href="mailto:infawn@gmail.com">infawn@gmail.com</a></>,
      <h2>Liability for Contents (Haftung für Inhalte)</h2>,
      'As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Abs. 1 DDG. According to §§ 8 to 10 DDG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
      'Obligations to remove or block the use of information in accordance with general laws remain unaffected by this. However, liability in this regard is only possible from the moment of knowledge of a specific infringement. Upon notification of corresponding rights violations, we will remove this content immediately.',
      <h2>Liability for Links (Haftung für Links)</h2>,
      'Our website may contain links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.',
      'The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a violation. Upon notification of rights violations, we will remove such links immediately.',
      <h2>Copyright (Urheberrecht)</h2>,
      'The content and works created by the site operator on these pages are subject to German copyright law (Deutsches Urheberrecht). Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.',
      'Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon notification of violations, we will remove such content immediately.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'The terms that govern your use of Find your next read.',
    body: [
      <>Last updated: <b>July 2026</b></>,
      'Welcome to Find your next read (hereinafter referred to as "the Website"). By accessing or using this Website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Website.',
      <h2>1. Content & Intellectual Property</h2>,
      'All content published on this Website—including book reviews, articles, summaries, text, logos, and overall design—is the intellectual property of the Website owner unless stated otherwise.',
      'You may read, share links, and quote short excerpts of the text provided that clear and proper credit/link-back is given to this Website.',
      'Commercial reproduction, redistribution, or republishing of any content without prior written consent is strictly prohibited.',
      <h2>2. Disclaimer & Nature of Information</h2>,
      'The content on this Website consists of personal opinions, literary analysis, and subjective reviews.',
      'All reviews and information are provided on an "as is" and "as available" basis for informational and entertainment purposes only.',
      'While I strive to ensure the accuracy of the information provided, I make no warranties or guarantees regarding the completeness or accuracy of any content.',
      <h2>3. External Links</h2>,
      'This Website may contain links to third-party websites (e.g., book retailers, publishers, or external information sources). These links are provided solely for your convenience.',
      'I have no control over the content, privacy policies, or practices of third-party websites.',
      'Inclusion of any link does not imply endorsement or responsibility for the material found on external sites.',
      <h2>4. Limitation of Liability</h2>,
      'In accordance with statutory provisions under German law:',
      'Liability for damages caused by minor negligence is excluded, provided these do not concern essential contractual obligations, injury to life, body, or health, or claims under mandatory statutory law.',
      'The Website owner shall not be liable for any indirect, incidental, or consequential damages arising out of your access to or use of the Website.',
      <h2>5. Comments and User Submissions</h2>,
      'If you leave comments or reviews on the Website, you agree not to post content that is unlawful, defamatory, abusive, or infringing on any intellectual property rights. The Website owner reserves the right to remove any comments at sole discretion without prior notice.',
      <h2>6. Governing Law & Jurisdiction</h2>,
      'These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Germany, without regard to its conflict of law provisions.',
      <h2>7. Contact Information</h2>,
      'For any questions regarding these Terms, please refer to the contact details provided on our About page.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Find your next read handles your data.',
    body: [
      <>Last updated: <b>August 2026</b></>,
      'This Privacy Policy describes how we, as the controller, process personal data when you visit the Website Find your next read. It fulfils our information duties under Articles 13 and 14 of the General Data Protection Regulation (GDPR/DSGVO) and § 5 of the German Digitale-Dienste-Gesetz (DDG).',
      <h2>1. Controller (Verantwortlicher)</h2>,
      'The controller responsible for the processing of personal data on this Website within the meaning of Art. 4 (7) GDPR is:',
      'Nikolai Surovegin',
      'Braunstr. 21',
      '24145 Kiel, Germany',
      <>Email: <a href="mailto:infawn@gmail.com">infawn@gmail.com</a></>,
      <h2>2. Data Protection Officer</h2>,
      'As a small-scale controller, we are not legally required to appoint a Data Protection Officer. For any data protection matters, please use the contact details above.',
      <h2>3. Data Processing in connection with Google Analytics 4</h2>,
      'We use Google Analytics 4 (GA4), a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland ("Google"), on this Website. The purpose of using GA4 is to analyse how visitors use our site in order to improve its content and user experience.',
      'GA4 uses cookies and similar storage technologies to collect pseudonymous usage data. The following categories of data are collected when you have given your consent:',
      <ul>
        <li>
          Your IP address, in truncated and anonymised form only. We have
          explicitly enabled the <code>anonymize_ip</code> setting, which
          shortens the IP address within the European Economic Area before any
          data is transmitted to Google. The full IP address is never stored on
          our or Google&apos;s servers.
        </li>
        <li>
          A pseudonymous Client ID assigned by Google and stored in the{' '}
          <code>_ga</code> cookie, used to recognise your browser across pages.
        </li>
        <li>
          Information about your device, browser, and operating system.
        </li>
        <li>
          The pages you visit on our Website, the duration of your visit, the
          referral source, and your approximate geographic region (derived from
          the anonymised IP address).
        </li>
        <li>
          Aggregate metrics such as page views, sessions, events and scroll
          depth.
        </li>
      </ul>,
      'The IP address transmitted by your browser within the framework of Google Analytics is not combined with other data held by Google.',
      <h2>4. Legal Basis</h2>,
      'The legal basis for the processing of data via GA4 is:',
      <ul>
        <li>
          <strong>
            Art. 6 (1) (a) GDPR
          </strong>{' '}
          — your explicit consent, which you give via our cookie consent banner.
        </li>
        <li>
          <strong>
            § 25 (2) TTDSG
          </strong>{' '}
          (Telekommunikation-Telemedien-Datenschutz-Gesetz) — your consent to the
          storage of, or access to, information in your end device
          (cookies/localStorage).
        </li>
      </ul>,
      'Consent is given voluntarily. You may withdraw it at any time without affecting the lawfulness of processing carried out before the withdrawal (Art. 7 (3) GDPR).',
      <h2>5. Purpose of Processing</h2>,
      'We process data via GA4 exclusively for the purpose of statistical analysis (Reichweitenmessung / Webanalyse). The data enables us to understand how visitors find and use our Website, which content is popular, and how the usability of the site can be improved. The data is not used to make individual decisions about you, nor is it used to create personalised advertising profiles.',
      <h2>6. Recipients of the Data</h2>,
      'The recipient of the data collected via GA4 is Google Ireland Limited, acting as our processor (Auftragsverarbeiter) within the meaning of Art. 28 GDPR. We have concluded a Data Processing Agreement (Auftragsverarbeitungsvertrag, AVV) with Google, which can be reviewed upon request.',
      'Google may, in turn, engage sub-processors (e.g. Google LLC, USA) for technical infrastructure. Further information on Google&apos;s sub-processors is available at <a href="https://privacy.google.com/businesses/subprocessors/" target="_blank" rel="noopener noreferrer">https://privacy.google.com/businesses/subprocessors/</a>.',
      <h2>7. Transfer to Third Countries (United States)</h2>,
      'Data collected by GA4 may be transferred to the United States of America. The European Commission has adopted an adequacy decision for the USA under the EU-US Data Privacy Framework (DPF) on 10 July 2023, which permits data transfers to US organisations that are certified under the DPF. Google LLC is certified under the DPF. The current certificate can be verified at <a href="https://www.dataprivacyframework.gov/" target="_blank" rel="noopener noreferrer">https://www.dataprivacyframework.gov/</a>.',
      'For transfers not covered by the DPF, appropriate safeguards are in place, in particular Standard Contractual Clauses (SCCs) between us, Google Ireland Limited, and Google LLC. A copy of the SCCs can be provided on request.',
      'Please be aware that, despite these safeguards, the possibility cannot be fully excluded that US authorities may access data for surveillance purposes in a manner that may not be subject to effective legal redress in the EU. For further information, please consult Google&apos;s privacy policy referenced in section 15.',
      <h2>8. Data Retention</h2>,
      'We have configured GA4 to retain user-level and event-level data for a maximum of 14 months. After this period, the data is automatically deleted or fully anonymised by Google. Aggregate, statistical data may be retained for a longer period in line with Google&apos;s own retention settings. Cookies set by GA4 have a default lifetime of up to 2 years, but are removed from your device as soon as you withdraw consent.',
      <h2>9. Technical and Organisational Measures (Art. 32 GDPR)</h2>,
      'We and Google have implemented appropriate technical and organisational measures to ensure a level of security appropriate to the risk:',
      <ul>
        <li>IP anonymisation (<code>anonymize_ip</code>) is enabled.</li>
        <li>Google Signals are disabled.</li>
        <li>Advertising reporting features and ad personalisation signals are disabled.</li>
        <li>User-ID data collection is not used.</li>
        <li>Data is transmitted exclusively over encrypted HTTPS connections.</li>
        <li>Cookies are set only after your explicit consent.</li>
      </ul>,
      'A description of the comprehensive security measures implemented by Google is available at <a href="https://safe.google.com/security/" target="_blank" rel="noopener noreferrer">https://safe.google.com/security/</a>.',
      <h2>10. Your Rights under GDPR</h2>,
      'You have the following rights with respect to the processing of your personal data:',
      <ul>
        <li>Right of access (Art. 15 GDPR)</li>
        <li>Right to rectification (Art. 16 GDPR)</li>
        <li>Right to erasure — "right to be forgotten" (Art. 17 GDPR)</li>
        <li>Right to restriction of processing (Art. 18 GDPR)</li>
        <li>Right to data portability (Art. 20 GDPR)</li>
        <li>Right to object (Art. 21 GDPR)</li>
        <li>Right to withdraw consent at any time (Art. 7 (3) GDPR)</li>
        <li>Right to lodge a complaint with a supervisory authority (Art. 77 GDPR)</li>
      </ul>,
      <h2>11. Right to Lodge a Complaint</h2>,
      'Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a supervisory authority in the EU member state of your habitual residence, your place of work, or the place of the alleged infringement. The competent supervisory authority for us is:',
      'Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein (ULD)',
      'Postfach 71 16',
      '24171 Kiel, Germany',
      <>Website: <a href="https://www.datenschutzzentrum.de" target="_blank" rel="noopener noreferrer">https://www.datenschutzzentrum.de</a></>,
      <h2>12. Withdrawal of Consent</h2>,
      'You can withdraw your consent to GA4 at any time with effect for the future. To do so, open "Cookie settings" in the footer of any page and uncheck the "Analytics" option. Upon withdrawal, Google Analytics will stop collecting new data, the GA4 cookies will be removed from your device, and we will initiate deletion of your pseudonymous data via the GA4 User Deletion API. Withdrawal does not affect the lawfulness of processing that took place before the withdrawal.',
      <h2>13. No Automated Decision-Making or Profiling</h2>,
      'There is no automated decision-making or profiling as described in Art. 22 GDPR in connection with the use of GA4 on this Website.',
      <h2>14. Server-Side Consent Record</h2>,
      'When you give or withdraw consent, a record of your choice is stored on our server. This record is required for us to demonstrate that we have obtained valid consent (Art. 7 (1) GDPR). The record contains:',
      <ul>
        <li>A pseudonymous subject identifier (your device ID).</li>
        <li>The categories of cookies you have consented to.</li>
        <li>The timestamp of your choice.</li>
        <li>The version of the policies you agreed to.</li>
        <li>The source of the choice (first banner, re-opened banner, settings page).</li>
      </ul>,
      'Your IP address is stored only in truncated and salted hashed form; the raw IP address is never persisted. The consent record is retained for the duration of the consent validity plus 6 months after withdrawal or expiry.',
      <h2>15. Updates to this Privacy Policy</h2>,
      'We may update this Privacy Policy to reflect changes in legal requirements, our processing activities, or Google&apos;s services. The current version is indicated at the top of this page. If we make material changes, we will request your consent again via our cookie banner.',
      <h2>16. Further Information</h2>,
      'For more information about how Google processes data, please consult Google&apos;s Privacy Policy at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a> and Google&apos;s information on how data is used for advertising at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/partner-sites</a>.',
      'If you have any questions regarding this Privacy Policy, please contact us using the details in section 1.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'How and why Find your next read uses cookies.',
    body: [
      <>Last updated: <b>August 2026</b></>,
      'This Cookie Policy explains what cookies and similar storage technologies (collectively, "cookies") are used on the Website Find your next read, why they are used, and how you can manage them. It should be read together with our Privacy Policy.',
      <h2>1. What are cookies?</h2>,
      <p className={styles.paragraph}>Cookies are small text files placed on your device by the websites you visit. They are widely used to make websites work more efficiently and to provide information to the owners of the site. On this Website, cookies are set either in your browser&apos;s cookie storage or in <code>localStorage</code>. For general information about cookies, you can visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>,
      <h2>2. Types of cookies we use</h2>,
      <h3>2.1 Strictly necessary cookies</h3>,
      'These cookies are required for the Website to function correctly — for example, to remember your cookie consent choice. They are set without requiring consent and cannot be disabled. Legal basis: Art. 6 (1) (f) GDPR (legitimate interests).',
      <h3>2.2 Analytics cookies (optional)</h3>,
      'These cookies are used by Google Analytics 4 to understand how visitors interact withWhat are cookies the Website. They are only set if you have given your explicit consent. Legal basis: Art. 6 (1) (a) GDPR and § 25 (2) TTDSG.',
      <h3>2.3 Marketing cookies (optional)</h3>,
      'These cookies would be used for advertising measurement and personalisation. We currently do not use marketing cookies. The option exists in our cookie settings for future compatibility; if you do not grant it, no marketing cookie is ever set.',
      <h2>3. Cookies used on this Website</h2>,
      'The table below lists all cookies that may be set on this Website. Strictly necessary cookies are always set. Analytics cookies are set only after your consent.',
      <CookiesTable />,
      <h2>4. Managing cookies</h2>,
      'You can manage your cookie preferences at any time:',
      <ul>
        <li>Click "Cookie settings" in the footer of any page to open the consent manager.</li>
        <li>You can also delete cookies already stored on your device via your browser settings. Instructions for common browsers are available at <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.</li>
      </ul>,
      'Disabling analytics cookies does not affect the functionality of the Website, but limits our ability to understand how the site is used.',
      <h2>5. Cookie lifetime</h2>,
      'Google Analytics 4 cookies have a default lifetime of up to 2 years from the date of issue or until you withdraw your consent. When you withdraw consent, we delete the GA4 cookies from your device. The locally stored consent record (<code>cookie_consent</code>) is retained for 12 months from the date you made your choice.',
      <h2>6. Server-side consent record</h2>,
      'When you give or withdraw consent, a record of your choice is stored on our server (see Privacy Policy section 14). It contains your pseudonymous subject identifier, the categories you consented to, the timestamp and the version of the policies you agreed to. The IP address is stored only in truncated and hashed form. The record is kept for the duration of the consent validity plus 6 months.',
      <h2>7. Changes to this Cookie Policy</h2>,
      'We may update this Cookie Policy from time to time. The "Last updated" date at the top of this page reflects the most recent version. If we make material changes, we will request your consent again via our cookie banner.',
      <h2>8. Contact</h2>,
      'For any questions regarding this Cookie Policy, please contact us using the details provided on our About page.',
    ],
  },
};

export const StaticPage = () => {
  const { slug = '' } = useParams();
  const content = PAGES[slug];

  if (!content) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.paragraph}>This page does not exist yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{content.title}</h1>
      {content.body.map((node, i) => {
        if (typeof node === 'string') {
          return (
            <p key={i} className={styles.paragraph}>
              {node}
            </p>
          );
        }
        return (
          <div key={i} className={styles.block}>
            {node}
          </div>
        );
      })}
    </div>
  );
};

export const getStaticPageMeta = (slug: string) => PAGES[slug];
