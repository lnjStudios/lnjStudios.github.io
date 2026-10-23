---
title: Writing for this site
description: A step-by-step guide to writing a note or a tool page for LnJ Studios, adding pictures and code, and sending it in. No coding or installs needed.
date: 2026-10-22
---

Every post on this site is a plain text file. You write it in your web browser on GitHub, send it in, and once it's been read through it goes live. No software to install, no code to learn. The first one takes about half an hour; after that, a few minutes.

This guide walks through it one click at a time. If something on your screen doesn't match, skip to [When something looks wrong](#when-something-looks-wrong) at the end.

## Before you start

You need three things:

1. **A free GitHub account.** GitHub is where the site's files live. Sign up at [github.com/signup](https://github.com/signup) if you don't have one.
2. **Your text.** Write it anywhere you like first (a notes app, an email draft). You'll paste it in later.
3. **Your pictures**, if any: photos or screenshots saved on your computer, as `.jpg` or `.png`.

## How a post is put together

A post is a **folder** with one text file in it, called `index.md`, plus any pictures that go with it:

```text
my-first-note/
├── index.md        ← your writing
├── robot.jpg       ← pictures for this post
└── wiring.png
```

The folder's name becomes the post's address: a folder called `my-first-note` in Notes is published at `lnjstudios.com/notes/my-first-note/`.

`index.md` has two parts: a short **settings block** at the top, between two lines of three dashes, and then **your writing**:

```markdown
---
title: My first note
description: One sentence about what this post is.
---

Your writing starts here.
```

That's all there is to it. The rest of this guide is about filling those two parts in.

## Step 1: Open the right folder

Go to the site's files on GitHub and open the folder for the kind of post you're writing:

- **A note** (a write-up from the bench, a how-I-did-it, a monthly log):
  open the [Notes folder on GitHub](https://github.com/lnjStudios/lnjStudios.github.io/tree/main/content/notes).
- **A tool** (a piece of software or hardware people can use):
  open the [Tools folder on GitHub](https://github.com/lnjStudios/lnjStudios.github.io/tree/main/content/tools).

You'll see one folder per existing post. Opening one of them to look at its `index.md` is a good way to see a finished example.

## Step 2: Create your post's file

1. Near the top right, click **Add file**, then **Create new file**.
2. In the box for the file name, type your folder name, a slash, and `index.md`. For example:

   ```text
   my-first-note/index.md
   ```

   When you type the slash, GitHub turns `my-first-note` into a folder. Use **lowercase letters and hyphens only**: no spaces, no capitals, no full stops.
3. If GitHub says *"You need to fork this repository to propose changes"*, click **Fork this repository**. That makes your own copy to work in; it's normal and harmless.

You now have an empty text box. Leave this page open.

## Step 3: Paste the template

Copy this whole block and paste it into the empty box:

```yaml
---
title: 'Your title here'
description: 'One sentence about what this post is.'
date: 2026-10-22
type: post
categories: [Notes]
tags: [ros2]
stage: in-progress
level: beginner
byline:
  name: Your Name
  avatar: https://github.com/your-github-username.png
---

Your writing starts here.
```

Then change the values to yours. Here's what each line means:

| Setting | What it is | Example |
|---|---|---|
| `title` | The post's title. Keep the quotes around it. | `'Wiring an ESP32 to a motor driver'` |
| `description` | One sentence. It appears under the title, on the post's card, and when the link is shared. | `'How I drove two DC motors from an ESP32.'` |
| `date` | The day you're publishing, written year-month-day. A date in the future stays hidden until that day. | `2026-10-22` |
| `type` | Always `post`. Don't change it. | `post` |
| `categories` | `[Notes]` or `[Tools]`, matching the folder you're in. | `[Notes]` |
| `tags` | A few topics, in lowercase, inside square brackets, separated by commas. Readers can click them to find similar posts. | `[esp32, motors, micro-ros]` |
| `stage` | How finished the thing you're writing about is: `prototype` (early days), `in-progress`, or `stable` (done). It shows as a small moving icon. | `stable` |
| `level` | Who it's for: `beginner`, `intermediate` or `advanced`. Leave the line out if it doesn't apply. | `beginner` |
| `byline` | Your name, and a picture of you. If you have a GitHub account, `https://github.com/` followed by your username and `.png` is your profile picture. Keep the two spaces before `name` and `avatar`. | `name: Asha Rao` |

If you write here regularly, Koustav can make you an **author page** (like [his](/koustav/)): your profile, linked from every post you write. Then, instead of the two `byline` lines, you only need one: `author: [your-id]`, for example `author: [asha]`.

A few optional settings go in the same block when you need them:

| Setting | What it does | Example |
|---|---|---|
| `cover` | The picture on the post's card and in link previews. Use a `.jpg` or `.png` in your folder, roughly twice as wide as it is tall. | `cover: robot.jpg` |
| `banner` | A wide picture made for the top of the post. Without one, the `cover` is used there. | `banner: banner.jpg` |
| `alt` | A short description of the cover picture, for people who can't see it. Always add one with a cover. | `alt: 'A small two-wheeled robot on a desk'` |
| `links` | Buttons in the post's "About this post" box. GitHub and YouTube links get their logo automatically. | see below |
| `license` | For tools: the licence the code is under. | `license: MIT` |
| `disclaimer` | A short note shown in the "About this post" box, like a trademark notice or a safety warning. | `disclaimer: 'Work with mains power at your own risk.'` |
| `lastmod` | Add this when you change a published post in a meaningful way; the post then says "Updated" with this date. | `lastmod: 2026-11-02` |

`links` is a list, one line per button, each starting with two spaces and a hyphen:

```yaml
links:
  - {label: Source code, url: 'https://github.com/your-name/your-project'}
  - {label: Build video, url: 'https://youtube.com/watch?v=...'}
```

## Step 4: Write

Everything below the second line of dashes is your post. Paste your text in, then add a little formatting. You don't need much: a heading every few paragraphs and the odd bold word go a long way.

| You type | You get |
|---|---|
| A blank line between paragraphs | Separate paragraphs. A single line break is ignored. |
| `## Wiring it up` | A section heading. Use two `#`s; the title already uses one. `###` makes a smaller heading inside a section. |
| `**important**` | **important** (bold) |
| `*the right way*` | *the right way* (italics) |
| `- first thing` on each line | A bullet list |
| `1. first step` on each line | A numbered list |
| `[the docs](https://docs.lnjstudios.com/)` | [the docs](https://docs.lnjstudios.com/), a link |
| `` `ros2 topic list` `` | `ros2 topic list`, a command or file name inside a sentence |
| `> A quote, or a warning.` | An indented quote |

Headings also build the **Contents** button next to your post, so readers can jump between sections.

To link to another post on this site, use its address without the domain, like `[ROS-Manager](/tools/ros-manager/)`.

### Tables

Tables are drawn with bars and dashes. The second line is always dashes:

```markdown
| Board  | Price | Wi-Fi |
|--------|-------|-------|
| ESP32  | Low   | Yes   |
| Arduino Uno | Low | No |
```

The bars don't need to line up; they only need to be there.

### Code and commands

For anything a reader might copy (commands, code, settings files), put it between two lines of three backticks. The backtick is the key above Tab, left of `1`. Write the language right after the first three backticks, so the code gets coloured:

````markdown
```bash
sudo apt install ros-jazzy-desktop
```
````

The site adds a **copy button** to every code block by itself, so readers can copy it in one click. Long lines scroll sideways on phones instead of wrapping, which keeps commands intact.

Common language names: `bash` (terminal commands), `python`, `cpp` (C++), `yaml`, `xml` (URDF, launch files), `json`, `text` (anything else).

## Step 5: Send it in

1. Click **Commit changes…** (or **Propose changes**) at the top right.
2. In the box that opens, write a short line about what you did, like *"New note: wiring an ESP32 to a motor driver"*.
3. If GitHub offers a choice, pick **Create a new branch for this commit and start a pull request**. Never pick *Commit directly to the main branch*: that would publish straight away, unchecked.
4. Click **Propose changes**, then on the next page **Create pull request**, and once more **Create pull request**.

A *pull request* is just "here's a change, please take a look". Your post is now waiting to be read. Nothing is live yet.

## Step 6: Add your pictures

Your pictures go into the same folder as `index.md`, on the same pull request.

1. At the top of your pull request, find the line that says something like *wants to merge 1 commit into main from **your-name:patch-1***. Click that last part (the name of your branch).
2. Open `content`, then `notes` (or `tools`), then your folder.
3. Click **Add file**, then **Upload files**, and drag your pictures in.
4. At the bottom, keep **Commit directly to the `patch-1` branch** selected (this time that's right: it's your branch, not the site's) and click **Commit changes**.

They're added to your pull request automatically. Then, in your text, put each picture where you want it:

```markdown
![A small two-wheeled robot on a desk](robot.jpg)
```

The words in square brackets describe the picture for people who can't see it, so make them say what's in it. The name in brackets must match the file name **exactly**, capital letters and `.jpg` / `.png` included.

To change your text after sending it, go to your folder on your branch the same way, open `index.md`, click the pencil icon, edit, and commit to the same branch.

## Step 7: What happens next

Koustav reads the post, sometimes suggests a change in a comment on the pull request (you'll get an email), and then publishes it. It's live a few minutes later at its address, for example `lnjstudios.com/notes/my-first-note/`, and shows up on the home page, in its category and in search.

### Before you send: a quick checklist

- The title and description read well out loud.
- Every picture has a description in its square brackets, and its file is in the folder.
- Commands and code are in code blocks, with the language written after the backticks.
- Headings every few paragraphs, starting at `##`.
- Links work (open them).

## A few house rules

- **Real things only.** Write about what you actually built, tried or measured. No made-up results, numbers or reviews.
- **Helpful and humble.** Explain like you would to a friend at the bench. Nothing salesy.
- **Say it once.** Don't repeat the same thing in the description, the first paragraph and the end.
- **Credit others.** Link to the projects, docs and people you learned from.

## When something looks wrong

**My post doesn't appear on the site.**
Check three settings: `type: post` is there; the `date` isn't in the future; and there's no line saying `draft: true` (delete it, or change it to `false`).

**The page shows an error, or the settings appear as text at the top of the post.**
The settings block is fussy about a few things:
- It must start and end with a line of exactly three dashes, `---`, with nothing else on those lines.
- Keep quotes around the `title` and `description`, especially if they contain a colon (`:`).
- Indent with spaces, never the Tab key. `name` and `avatar` under `byline` need exactly two spaces in front.

**A picture doesn't show.**
The file name in `![...](...)` must match the file exactly, capital letters and extension included (`Robot.JPG` and `robot.jpg` are different), and the picture must be in the same folder as `index.md`.

**My code isn't coloured.**
Check the language name right after the opening backticks (`bash`, `python`, `cpp`...), with no space between them.

**Something else.**
Ask in a comment on your pull request. That's what it's there for.

## For the curious: preview on your own computer

If you'd like to see your post exactly as it'll look before sending it, you can run the whole site on your computer. You'll need [Git](https://git-scm.com/downloads) and [Hugo](https://gohugo.io/installation/) (the "extended" edition) installed, then, in a terminal:

```bash
git clone --recurse-submodules https://github.com/lnjStudios/lnjStudios.github.io.git
cd lnjStudios.github.io
hugo new content notes/my-first-note/index.md   # makes the folder, fills in the template
hugo server                              # then open http://localhost:1313 in your browser
```

The page refreshes by itself every time you save. New posts start with `draft: true`, which shows them on your computer but keeps them off the real site; delete that line when the post is ready.
