import { UserIcon, CalendarIcon, LibraryIcon, GlobeIcon } from '../../../icons';
import { Book } from 'types';
import { languageName } from '../../../constants';
import styles from './summary-meta.module.scss';

type SummaryMetaProps = {
  book: Book;
};

const META = [
  { Icon: UserIcon, label: 'Author', valueKey: 'author' },
  { Icon: CalendarIcon, label: 'Published', valueKey: 'published' },
  { Icon: LibraryIcon, label: 'Pages', valueKey: 'pages' },
  { Icon: GlobeIcon, label: 'Language', valueKey: 'language' },
] as const;

const formatValue = (key: string, value: string | number): string | number =>
  key === 'language' ? languageName(value as string) : value;

export const SummaryMeta = ({ book }: SummaryMetaProps) => (
  <div className={styles.meta}>
    {META.map(({ Icon, label, valueKey }) => (
      <div key={label} className={styles.metaItem}>
        <div className={styles.metaTitle}>
          <span className={styles.metaIcon}>
            <Icon size={16} />
          </span>
          <span className={styles.metaLabel}>{label}</span>
        </div>
        <span className={styles.metaValue}>
          {formatValue(valueKey, book[valueKey])}
        </span>
      </div>
    ))}
  </div>
);
