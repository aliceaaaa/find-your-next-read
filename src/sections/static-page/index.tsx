import { useParams } from 'react-router-dom';
import styles from './static-page.module.scss';

type StaticContent = {
  title: string;
  description: string;
  body: string[];
};

// Заглушки. Реальные юридические тексты подставим позже.
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
      'These Terms of Service are a placeholder and will be replaced with the final legal text.',
      'By using the service you agree to the terms that will be published here.',
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
