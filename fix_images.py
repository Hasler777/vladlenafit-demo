#!/usr/bin/env python3
import glob, re, os

SWAP_JS = """
<script>
/* local fix: swap Tilda lazy placeholders for real images, no scroll/JS-lib needed */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img[data-original]').forEach(function (el) {
    var u = el.getAttribute('data-original');
    if (u) { el.src = u; el.removeAttribute('srcset'); el.style.filter = 'none'; }
  });
  document.querySelectorAll('[data-original]').forEach(function (el) {
    if (el.tagName === 'IMG') return;
    var u = el.getAttribute('data-original');
    if (u) { el.style.backgroundImage = "url('" + u + "')"; el.style.filter = 'none'; }
  });
  /* kill leftover blur on Tilda lazy wrappers */
  document.querySelectorAll('.t-bgimg, .t-img').forEach(function (el) { el.style.filter = 'none'; });
});
</script>
""".strip()

files = glob.glob('vladlenafit.ru/*.html')
for f in files:
    s = open(f, encoding='utf-8').read()
    before = s
    # rewrite absolute image CDN links -> local relative (page lives in vladlenafit.ru/)
    s = s.replace('https://static.tildacdn.com/tild', '../static.tildacdn.com/tild')
    s = s.replace('http://static.tildacdn.com/tild', '../static.tildacdn.com/tild')
    s = s.replace('//static.tildacdn.com/tild', '../static.tildacdn.com/tild')
    # inject swap script once, before </body>
    if 'local fix: swap Tilda' not in s and '</body>' in s:
        s = s.replace('</body>', SWAP_JS + '\n</body>', 1)
    if s != before:
        open(f, 'w', encoding='utf-8').write(s)
        print('fixed:', os.path.basename(f))
    else:
        print('no change:', os.path.basename(f))
