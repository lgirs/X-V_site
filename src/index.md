---
title: Welcome to X/V
layout: base.html
---

This is the first page of the <span class="cutout-text">X/V</span> website. More chaos coming soon!

## Explore the contents

<div class="tag-list">
{% for tag in collections.tagList %}
    <a href="/tags/{{ tag }}/">{{ tag }}</a>
{% endfor %}
</div>

## Arcade
[Play Pong Invaders](arcade/)
