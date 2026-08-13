# Feather

**Feather is plain text that reads like a manuscript and knows it is a book.**

Feather (`.feather`) is a small manuscript-oriented markup language for prose. It uses traditional manuscript conventions for ordinary writing and familiar Markdown notation only for things a typewritten manuscript could not naturally express.

Feather is **not** a strict superset of Markdown. Where Feather has its own native convention, Feather wins. For example, a line containing only `#` is a scene break, and indentation means an epigraph or extract rather than a code block.

## A complete example

```text
THE LONG NIGHT


PART I
THE CITY


CHAPTER 1
THE CALL

    We are such stuff as dreams are made on.
        -- William Shakespeare, The Tempest

The rain had been falling for three days.

Maria hadn't slept for two of them.

#

When the telephone finally rang, she already knew who it was.

She opened the letter:

    Judith,

    Don't come looking for me.

        -- J


CHAPTER 2
THE HOUSE

The house stood at the end of a road that wasn't on any map.
```

A `.feather` file can contain one chapter, several chapters, a whole part, or an entire book. The language does not depend on the filesystem for semantic structure.

## Structural divisions

Feather recognizes these standalone manuscript headings:

```text
VOLUME I
BOOK ONE
PART II
CHAPTER 12
PROLOGUE
EPILOGUE
INTRODUCTION
PREFACE
AFTERWORD
INTERLUDE
APPENDIX A
```

The structural word is case-insensitive. The rest of the same line is the division's qualifier/number.

An optional title can appear on the **immediately following line**:

```text
CHAPTER 12
The Long Night

The rain began.
```

If a division has no title, leave a blank line after the structural heading:

```text
CHAPTER 12

The rain began.
```

Every structural division above becomes a reading unit in the web reader, so a single file can generate several entries in the table of contents and several Previous/Next destinations.

### Leading manuscript title

A short line at the very beginning of a multi-division Feather file, followed by a blank line and then a structural division, is treated as the manuscript title rather than as prose:

```text
THE LONG NIGHT

CHAPTER 1
The Call
```

The library's displayed book title still comes from `book.txt` when present, or from the book folder name as a fallback.

## Sections / subheadings

`SECTION` creates a heading **inside the current reading unit** rather than a new reader page:

```text
CHAPTER 4
The Investigation

SECTION
The First Suspect

Text...

SECTION 2
The Second Suspect

Text...
```

Sections appear as nested links in the book's table of contents and as headings inside the chapter/page.

## Paragraphs

Blank lines separate paragraphs. A single line break inside ordinary prose is treated as a space.

```text
This is one
paragraph.

This is another paragraph.
```

Source indentation is not required for ordinary first-line paragraph indents; typography belongs to the renderer.

## Epigraphs

An indented block before body prose begins in a reading unit is an epigraph. A final indented line beginning with `--`, `—`, or `–` is its attribution.

```text
CHAPTER 3
The Door

    We are such stuff as dreams are made on.
        -- William Shakespeare, The Tempest

The door was open.
```

Multiple indented blocks before body prose become multiple epigraphs.

## Extracts, letters, and displayed prose

After body prose has begun, an indented block is an extract:

```text
She unfolded the letter.

    Dear Judith,

    I am leaving.

    Love,
    John

She read it twice.
```

Blank lines inside an indented block are preserved as separate paragraphs.

## Scene / thematic breaks

A line containing only `#` means a semantic scene or thematic break:

```text
The door slammed behind him.

#

Six months later, Judith saw him again.
```

The renderer decides how the break looks. The current web reader displays `⁂`.

## Inline emphasis

Typewriter-style underlining is represented with underscores and rendered as italics:

```text
I told you _not_ to open it.
```

Strong emphasis uses familiar Markdown notation:

```text
This is **important**.
```

Single-star emphasis (`*text*`) is also accepted for convenience, though `_text_` is Feather's preferred form.

## Links

Feather adopts Markdown link syntax:

```text
Read the [full report](https://example.com/report).
```

Relative links are also allowed. Unsafe URL schemes such as `javascript:` are not rendered as links.

## Images

Feather adopts Markdown image syntax:

```text
![The expedition team at the summit](images/summit.jpg)
```

Relative image paths are resolved from the folder containing the `.feather` file. Images can therefore live beside the manuscript or inside an `images/` subfolder.

Alt text remains meaningful even in output formats that cannot display the image.

## Lists

Unordered and ordered Markdown-style lists are supported:

```text
The experiment required:

- three glass containers
- distilled water
- a thermometer
```

```text
The procedure was:

1. Heat the water.
2. Add the solution.
3. Wait twenty minutes.
```

The current Feather parser intentionally keeps lists simple: one line per item, with no nested-list grammar yet.

## Inline and fenced code

Inline code:

```text
Run `npm run preview` to start the local reader.
```

Fenced code blocks:

````text
```javascript
console.log("Hello");
```
````

The optional language name is preserved as a CSS class for syntax-highlighting integrations, though the built-in reader does not add a highlighting library.

## Footnotes

Feather uses the familiar Markdown-extension footnote notation:

```text
The expedition began in 1897.[^date]

[^date]: Some contemporary accounts give the date as 1898.
```

Footnote definitions may appear anywhere in the same `.feather` file. Footnote identifiers are file-scoped and should be unique within that file.

## Tables

Simple pipe tables are supported for nonfiction:

```text
| Year | Population |
| --- | ---: |
| 1900 | 4,201 |
| 1920 | 7,844 |
```

The alignment markers `:---`, `---:`, and `:---:` are supported.

## Deliberately not Markdown

When Feather has a manuscript-native convention, do not use the Markdown equivalent:

- headings use `CHAPTER`, `PART`, `SECTION`, etc., not `# Heading`
- a line containing only `#` is a scene break
- indented prose is an epigraph or extract, not a code block
- displayed quotations/extracts use indentation rather than `>` blockquotes

`---` currently has no special Feather meaning and is intentionally left available for future use.

## File model

A Feather file is a **manuscript**, not a chapter file. All of these are valid:

```text
01-chapter.feather
```

```text
01-05.feather
06-10.feather
```

```text
novel.feather
```

The library scanner sorts `.feather` files by filename, then scans the structure *inside* each file. Structural divisions determine the table of contents and reading order. `SECTION` headings become subheadings within their containing reading unit.
