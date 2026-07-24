import { useParams } from 'react-router-dom';
import styles from './static-page.module.scss';

type StaticContent = {
  title: string;
  description: string;
  body: React.ReactNode[];
};

// Заглушки
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
      'This Privacy Policy is a placeholder and will be replaced with the final legal text.',
      'It will describe what data we collect, why, and how it is stored.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'How and why Find your next read uses cookies.',
    body: [
      'This Cookie Policy is a placeholder and will be replaced with the final legal text.',
      'It will list the cookies we use and their purpose.',
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
      {content.body.map((paragraph, i) => (
        <p key={i} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export const getStaticPageMeta = (slug: string) => PAGES[slug];
