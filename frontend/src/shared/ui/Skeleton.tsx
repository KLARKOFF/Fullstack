interface SkeletonProps {
  width?: string;
  height?: string;
}

/** Серый мерцающий прямоугольник на месте данных, которые ещё грузятся. */
export function Skeleton({ width = '100%', height = '14px' }: SkeletonProps) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}
