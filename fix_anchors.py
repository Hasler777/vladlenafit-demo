#!/usr/bin/env python3
import glob, os, re

# wget переписал внутристраничные якоря "#rec" -> "<страница>.html#rec",
# из-за чего JS Тильды (попапы, подменю, плавный скролл) перестал их ловить.
# Возвращаем чистый фрагмент "#..." только когда ссылка ведёт на ТУ ЖЕ страницу.
total = 0
for f in glob.glob('vladlenafit.ru/*.html'):
    name = os.path.basename(f)
    s = open(f, encoding='utf-8').read()
    before = s
    # href="name#..."  -> href="#..."   (обе кавычки)
    s = s.replace('href="%s#' % name, 'href="#')
    s = s.replace("href='%s#" % name, "href='#")
    n = before.count('href="%s#' % name) + before.count("href='%s#" % name)
    if s != before:
        open(f, 'w', encoding='utf-8').write(s)
        total += n
        print('%-16s исправлено якорей: %d' % (name, n))
    else:
        print('%-16s — нет внутристраничных якорей с префиксом' % name)
print('ИТОГО исправлено:', total)
