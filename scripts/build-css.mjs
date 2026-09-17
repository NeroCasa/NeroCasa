/**
 * Historical merge helper. Storefront CSS now lives in assets/nerocasa.css.liquid.
 * Edit that file directly; do not recreate nerocasa-additions.css / nerocasa-luxury.css.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const css = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'nerocasa.css.liquid');
if (!fs.existsSync(css)) {
  console.error('missing assets/nerocasa.css.liquid');
  process.exit(1);
}
console.log('CSS source of truth is assets/nerocasa.css.liquid (' + fs.statSync(css).size + ' bytes). No rebuild.');
