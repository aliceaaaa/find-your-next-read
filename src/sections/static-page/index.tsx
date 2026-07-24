import { useParams } from 'react-router-dom';
import styles from './static-page.module.scss';

type StaticContent = {
  title: string;
  description: string;
  body: string[];
};

// Заглушки
const PAGES: Record<string, StaticContent> = {
  about: {
    title: 'About',
    description: 'What Find your next read is and who it is for.',
    body: [
      'Find your next read helps you discover books worth your time — browse the library, search by title, author or genre, and keep track of what you want to read next.',
      'This is a placeholder page. Real copy will go here.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'The terms that govern your use of Find your next read.',
    body: [
      'Last updated: July 2026',
      'Welcome to Find your next read (hereinafter referred to as "the Website"). By accessing or using this Website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Website.',
      '1. Content & Intellectual Property',
      'All content published on this Website—including book reviews, articles, summaries, text, logos, and overall design—is the intellectual property of the Website owner unless stated otherwise.',
      'You may read, share links, and quote short excerpts of the text provided that clear and proper credit/link-back is given to this Website.',
      'Commercial reproduction, redistribution, or republishing of any content without prior written consent is strictly prohibited.',
      '2. Disclaimer & Nature of Information',
      'The content on this Website consists of personal opinions, literary analysis, and subjective reviews.',
      'All reviews and information are provided on an "as is" and "as available" basis for informational and entertainment purposes only.',
      'While I strive to ensure the accuracy of the information provided, I make no warranties or guarantees regarding the completeness or accuracy of any content.',
      '3. External Links',
      'This Website may contain links to third-party websites (e.g., book retailers, publishers, or external information sources). These links are provided solely for your convenience.',
      'I have no control over the content, privacy policies, or practices of third-party websites.',
      'Inclusion of any link does not imply endorsement or responsibility for the material found on external sites.',
      '4. Limitation of Liability',
      'In accordance with statutory provisions under German law:',
      'Liability for damages caused by minor negligence is excluded, provided these do not concern essential contractual obligations, injury to life, body, or health, or claims under mandatory statutory law.',
      'The Website owner shall not be liable for any indirect, incidental, or consequential damages arising out of your access to or use of the Website.',
      '5. Comments and User Submissions',
      'If you leave comments or reviews on the Website, you agree not to post content that is unlawful, defamatory, abusive, or infringing on any intellectual property rights. The Website owner reserves the right to remove any comments at sole discretion without prior notice.',
      '6. Governing Law & Jurisdiction',
      'These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Germany, without regard to its conflict of law provisions.',
      '7. Contact Information',
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
