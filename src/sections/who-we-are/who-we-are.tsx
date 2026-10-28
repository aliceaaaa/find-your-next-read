import { KeyboardEvent, useState } from 'react';
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
  bio?: string[];
};

const TEAM: Member[] = [
  {
    name: 'Nikolai',
    caption: 'reads with eyes closed',
    photo: '/team/nikolai.jpg',
    bio: [
      'Nikolai will write something about himself at some point.',
      'For sure. Definitely. He’s almost done. The draft is practically in his head already.',
      'Any day now…',
    ],
  },
  {
    name: 'Alice',
    caption: 'lives in a fairy forest',
    photo: '/team/alisa.jpg',
    bio: [
      'Hi, I’m Alice: full-stack developer by day, indie creator by night and a self-proclaimed comedian at all hours (the jury’s still out).',
      'I write book reviews the old-fashioned way, entirely by myself, like a medieval peasant with a keyboard. You’ll know it’s really me from the bold grammar choices.',
      'I also build my own apps and every now and then I do it without AI, just to remind myself what suffering, I mean craftsmanship, feels like.',
    ],
  },
  {
    name: 'Ilya',
    caption: 'identity pending',
    bio: ['Ilya is mysterious.'],
  },
];

const MemberCard = ({ member, index }: { member: Member; index: number }) => {
  const { name, caption, photo, bio } = member;
  const [flipped, setFlipped] = useState(false);
  const canFlip = !!bio?.length;
  const number = `Nº 0${index + 1}`;

  const flip = () => {
    if (canFlip) {
      setFlipped((value) => !value);
    }
  };

  const handleClick = () => {
    if (!window.matchMedia?.('(hover: hover)').matches) {
      flip();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  };

  return (
    <li
      className={cn(styles.member, styles[`member-${index + 1}`], {
        [styles.flippable]: canFlip,
        [styles.flipped]: flipped,
      })}
    >
      <div
        className={styles.card}
        onClick={handleClick}
        {...(canFlip && {
          role: 'button',
          tabIndex: 0,
          'aria-pressed': flipped,
          'aria-label': flipped ? `Back to ${name}'s photo` : `About ${name}`,
          onKeyDown: handleKeyDown,
        })}
      >
        <div className={cn(styles.face, styles.front)} aria-hidden={flipped}>
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
            <span className={styles.number}>{number}</span>
            <span className={styles.name}>{name}</span>
            <span className={styles.role}>{caption}</span>
          </div>
        </div>
        {canFlip && (
          <div className={cn(styles.face, styles.back)} aria-hidden={!flipped}>
            <span className={styles.number}>{number}</span>
            <span className={styles.name}>{name}</span>
            <div className={styles.bio}>
              {bio?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

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

    <p className={styles.hint}>
      Psst… <span className={styles['hint-hover']}>hover over</span>
      <span className={styles['hint-tap']}>tap</span> us to get to know us
      better <span aria-hidden="true">↓</span>
    </p>

    <ul className={styles.team}>
      {TEAM.map((member, i) => (
        <MemberCard key={member.name} member={member} index={i} />
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
