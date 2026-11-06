/** Склеивает CSS-классы, пропуская пустые: cx('btn', isSmall && 'btn-small'). */
export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');
