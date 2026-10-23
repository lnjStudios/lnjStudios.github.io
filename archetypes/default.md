---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
description: ''
date: {{ .Date }}
draft: true
type: post
categories: [Notes]  # or Tools
tags: []
stage: in-progress  # prototype, in-progress or stable (content/stage/)
# "About this post" panel (layouts/partials/post/tagged.html); all optional:
# level: beginner     # beginner, intermediate or advanced
# license: MIT
# links:
#   - {label: Source & issues, url: 'https://github.com/koustavbetal/...'}   # icon guessed: github, youtube, docs
# disclaimer: ''      # markdown
author: [koustav]  # an author page in content/author/<id>/ (name, picture, profile link come from it)
# no author page? use a byline instead:
# byline:
#   name: Your Name
#   avatar: https://github.com/your-username.png  # a link, or a site path like /images/brand/me.png
# lastmod: YYYY-MM-DD  # set when the post is meaningfully edited; shown as "Updated ..."
---
