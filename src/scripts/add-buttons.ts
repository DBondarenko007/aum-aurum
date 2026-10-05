// "+" buttons on product cards: add one item to the cart and show a check for a moment.
import { addToCart } from './cart';

document.querySelectorAll<HTMLButtonElement>('button.add[data-slug]').forEach((btn) => {
  if (btn.dataset.bound) return;
  btn.dataset.bound = '1';
  let t: number | undefined;
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.slug!);
    btn.classList.add('done');
    clearTimeout(t);
    t = window.setTimeout(() => btn.classList.remove('done'), 1400);
  });
});
