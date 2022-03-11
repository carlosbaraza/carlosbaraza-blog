---
title: ${post.title}<% if (post.slug) { %>
slug: ${post.slug}<% } %>
date_published: "${post.publishedAt}"
date_updated: "${post.updatedAt}"
tags: [${post.tags.map(t => '"' + t +'"').join(', ')}]
draft: ${post.status === 'draft'}<% if (post.custom_excerpt) { %>
summary: "${post.custom_excerpt.trim()}"<% } %>
---

${post.markdown}
