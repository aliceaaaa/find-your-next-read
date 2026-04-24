type StarRatingProps = {
  rating: number;
  size?: number;
};

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

const StarIcon = ({
  fill,
  size,
  id,
}: {
  fill: 'full' | 'half' | 'empty';
  size: number;
  id: string;
}) => {
  const clipId = `half-${id}`;
  const halfTestId = `half-clip-${id}`;

  return (
    <svg
      data-testid="star-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {fill === 'half' && (
        <defs>
          <clipPath id={clipId} data-testid={halfTestId}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
      )}

      {/* Фон (пустая звезда) */}
      <path d={STAR_PATH} fill="#E8E8E8" />

      {/* Заливка */}
      {fill === 'full' && (
        <path d={STAR_PATH} fill="var(--color-star, #c80e1e)" />
      )}
      {fill === 'half' && (
        <path
          d={STAR_PATH}
          fill="var(--color-star, #c80e1e)"
          clipPath={`url(#${clipId})`}
        />
      )}
    </svg>
  );
};

export const StarRating = ({ rating, size = 16 }: StarRatingProps) => (
  <span
    data-testid="star-rating"
    style={{
      display: 'inline-flex',
      gap: 3,
      alignItems: 'center',
      lineHeight: 1,
    }}
  >
    {[1, 2, 3, 4, 5].map((i) => {
      const fill =
        i <= Math.floor(rating) ? 'full' : i - 0.5 <= rating ? 'half' : 'empty';
      const id = `star-${i}-${rating}`;

      return <StarIcon key={i} id={id} fill={fill} size={size} />;
    })}
  </span>
);
