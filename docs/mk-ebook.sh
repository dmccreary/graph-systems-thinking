#!/bin/sh

# UNIX shell script to build a full e-book from all of the markdown files in the book
# TODO - generate this list from the mkdocs.yml nav file

cat \
  intro/cover.md \
  intro/preface.md \
  intro/acknowledgements.md \
  intro/forward.md \
  intro/about-this-book.md \
  intro/about-the-authors.md \
  intro/ch-01.md \
  intro/ch-02.md \
  intro/ch-03.md \
  intro/ch-04.md \
  concepts/ch-05.md \
  glossary.md \
  references.md \
  colophon.md \
  >full-book.md

  pandoc full-book.md --metadata title="Graphs and Systems Thinking" -o /tmp/full-book.epub
  echo "full book now available in /tmp/full-book.epub"
  open /tmp/full-book.epub

