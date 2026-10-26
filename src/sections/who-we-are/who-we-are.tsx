import cn from 'classnames';
import styles from './who-we-are.module.scss';

const MARQUEE = [
  'We read books',
  'We have opinions',
  'They might not be yours',
  'That is fine',
  'Est. somewhere',
];

type Member = {
  name: string;
  caption: string;
  photo?: string;
};

const TEAM: Member[] = [
  {
    name: 'Nikolai',
    caption: 'reads with eyes closed',
    photo: '/team/nikolai.jpg',
  },
  {
    name: 'Alice',
    caption: 'lives in a fairy forest',
    photo: '/team/alisa.jpg',
  },
  { name: 'Ilya', caption: 'identity pending' },
];

export const WhoWeArePage = () => (
  <article className={styles.page}>
    <header className={styles.hero}>
      <p className={styles.kicker}>Issue Nº 001 — a small zine about books</p>
      <h1 className={styles.headline}>
        <span className={styles.who}>Who</span>
        <span className={styles['we-are']}>we are</span>
      </h1>
      <span className={styles.sticker} aria-hidden="true">
        100%
        <br />
        opinions
      </span>
    </header>

    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {[...MARQUEE, ...MARQUEE].map((item, i) => (
          <span key={i}>
            {item} <b>✶</b>
          </span>
        ))}
      </div>
    </div>

    <ul className={styles.team}>
      {TEAM.map(({ name, caption, photo }, i) => (
        <li key={name} className={cn(styles.member, styles[`member-${i + 1}`])}>
          <div className={styles.frame}>
            {photo ? (
              <img src={photo} alt={name} className={styles.photo} />
            ) : (
              <div className={styles.unknown} role="img" aria-label={name}>
                ?
              </div>
            )}
          </div>
          <div className={styles.caption}>
            <span className={styles.number}>Nº 0{i + 1}</span>
            <span className={styles.name}>{name}</span>
            <span className={styles.role}>{caption}</span>
          </div>
        </li>
      ))}
    </ul>

    <section className={styles.manifesto}>
      <p className={styles.lead}>
        We're just some <em>dudes</em>.
      </p>
      <p className={styles.text}>
        We read books and have opinions about them! Yours might be different,
        and that's fine! You can make your own website and share them with the
        world.
      </p>
      <p className={cn(styles.text, styles.aside)}>
        Just kidding! We'd love to hear yours too, but that part of the site is
        still under construction.
      </p>
    </section>

    <div className={styles.construction} aria-hidden="true">
      <span>Under construction</span>
      <span>Under construction</span>
      <span>Under construction</span>
    </div>
  </article>
);
