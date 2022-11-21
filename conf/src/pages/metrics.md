---
permalink: false
templateEngineOverride: njk
tags: post
title: Relation Metrics
slug: metrics
menuTitle: Metrics
position: 3
authors:
  - name:
      first: Luke
      last: Thorburn
      url: https://lukethorburn.com/
  - name:
      first: Aviv
      last: Ovadya
      url: https://aviv.me/
description: A review of metrics for quantifying degrees of "division" or "polarization".
---

- The metrics are designed to summarize an abstract model of the public sphere, which we assume is either a graph (e.g. a network of Twitter followers) or a set of points in Euclidean space (e.g. user embeddings on a social media platform).
- Graph-based models can be converted into space-based models using graph embeddings. Space-based models can be converted into graph-based models using techniques from topological data analysis.
- The semantics and provenance of the underlying model matter just as much as the metrics that are applied "on top".
- Not yet making any strong claims about which are most valid. Many of these should not be used for optimization.

# Table of Metrics

Use the `Esc` key to toggle full screen.

<div class="outer-wrap" id="table-of-metrics">
	<button onclick="document.querySelector('html').classList.toggle('fullscreen')">
		<span class="expand"><i class="fas fa-expand-wide"></i>&ensp;View Fullscreen</span>
		<span class="compress"><i class="fas fa-compress-wide"></i>&ensp;Exit</span>
	</button>
	<div class="inner-wrap"></div>
</div>
<script src="/js/metrics-table.js"></script>

# Notation

## Graphs

- $G(V,E)$ is the graph
- $v\in V$ vertices
- $d(v)$ degree of vertex $v$
- $d_i(v)$ vertices in group $i$ to which $v$ is connected
- $G_1,\dots,G_M$ are the groups or clusters of vertices
- $g(v)$ the group of vertex $v$
- $E$ the set of edges
- $R(t)$ a random walk on the graph, as a function of time $t$
- $G_i^+$ the set of $k$ highest-degree nodes in each group
- $c(G)$ is the number of 3-cycles in a graph, $c_+(G)$ is the number of positive 3-cycles in a graph, where the sign of a graph is the product of the signs of its edges


## Spaces

- $\mathcal{X}$ is the set of points representing individuals
- $N$ number of individuals
- $n_i$ number of individuals in group $i$
- $\bar{x}$ is the mean of the points in $\mathcal{X}$
- $B_r(x)$ ball of radius $r$ centered on $x$
- $M$ number of groups or clusters
- $G_1,\dots,G_M$ are the groups or clusters