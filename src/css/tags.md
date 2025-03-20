---
title: Explore by Tags
layout: base.html
pagination:
    data: collections
    size: 1
    alias: tag
permalink: "/tags/{{ tag }}/"
---

# {{ tag | capitalize }}

{% for post in collections[tag] %}
- [{{ post.data.title }}]({{ post.url }})
{% endfor %}
