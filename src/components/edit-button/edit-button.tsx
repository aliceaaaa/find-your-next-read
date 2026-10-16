import cn from "classnames";
import { PencilIcon } from "../../icons";
import styles from "./edit-button.module.scss";

type EditButtonProps = {
  onClick: () => void;
  label: string;
  size?: number;
  className?: string;
};

export const EditButton = ({
  onClick,
  label,
  size = 20,
  className,
}: EditButtonProps) => (
  <button
    type="button"
    className={cn(styles.button, className)}
    onClick={onClick}
    aria-label={label}
    data-tooltip={label}
  >
    <PencilIcon size={size} />
  </button>
);
