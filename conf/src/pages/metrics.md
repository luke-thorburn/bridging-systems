---
permalink: false
templateEngineOverride: njk
tags: post
menuTitle: Metrics
title: Relation Metrics
slug: metrics
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
date: 2023-01-10
---

The metrics are designed to summarize an abstract model of the public sphere, which we assume is either a graph (e.g. figure **A**, or a network of Twitter followers) or a set of points in Euclidean space (e.g. figure **B**, or user embeddings on a social media platform).

<div class="fig outset-2">
	<img src="/img/model-types.png" alt="Simple examples of graph-based and space-based relation models." />
</div>

As per the terminology introduced in the [paper](/files/bridging-systems-working-paper.pdf), these are examples of **relation metrics**, because they summarize the *state* of a relation model at a give point in time. In contrast **bridging metrics**—not yet reviewed here—summarize a *change* in relation metrics over time.

<div class="spacer"></div>

# Table of Metrics

To toggle fullscreen mode, use your `Esc` key or the purple button in the table.

<div class="outer-wrap" id="table-of-metrics">
	<button onclick="document.querySelector('html').classList.toggle('fullscreen')">
		<span class="expand"><i class="fas fa-expand-wide"></i>&ensp;View Fullscreen</span>
		<span class="compress"><i class="fas fa-compress-wide"></i>&ensp;Exit</span>
	</button>
	<div class="inner-wrap"></div>
</div>
<script src="/js/metrics-table.js"></script>

<div class="spacer"></div>

# Caution

Broadly, our aim with this work is to get better at building systems that increase mutual understanding and trust across divides, creating space for productive conflict, deliberation, or cooperation. These metrics are presented here as possible measures of this "bridging goal", but most of the metrics are obviously not plausible such measures. The best we can say about some of the metrics is that we do not yet know whether they are good measures. For this reason, none of the metrics on this page should be used as optimization targets in an attention-allocator (such as a social media platform) without considerable care to monitor and avoid unintended consequences.

Also, note that these metrics are simply summaries of the structure of some abstract model, such as a graph-based or space-based relation model. The provenance or "semantics" of the underlying relation model is also important to consider. For example, a given metric may be an excellent measure of the bridging goal when applied to a relation model that captures goodwill between people, but be a poor measure when applied to a relation model that captures similarities in people's patterns of engagement on social media. At present, we know very little about which types of relation models and which relation metrics can be validly used as a basis for bridging.

<div class="spacer"></div>

# Notation

Here, we introduce the notation used in the formulae in the above table. The notation differs by model type.

## Graph

Let $G=(V,E)$ denote a (mathematical) graph, where $V$ is the set of vertices and $E$ is the set of edges. Optionally, the vertices may each belong to one of $M$ groups, denoted $G_1,\dots,G_M$, which form a partition of $V$. For a vertex $v\in V$, we use $d(v)$ to denote the degree of the vertex and $d_i(v)$ to denote the numbe of vertices in group $i$ to which $v$ is connected. If there are groups, $g(v)$ refers to the group which contains vertex $v$.

There are a few more specific notations that are only used in a small number of metrics.

- $R(t)$ denotes a random walk on the graph, as a function of time $t$. In the formulae, we simply write $R(\mathsf{start})$ or $R(\mathsf{end})$, which should be interpreted in the intuitive way.
- For a given $1<i<M$, $G_i^+$ denotes the set of $k$ highest-degree nodes in group $G_i$.
- If $G$ is a signed graph, $G=(V,E^+,E^-)$, then $c(G)$ denotes is the number of 3-cycles in a graph, and $c_+(G)$ is the number of positive 3-cycles in a graph, where the sign of a cycle is the product of the signs of its edges.

## Space

Let $\mathcal{X}$ be a set of $N$ points in some metric space $\mathcal{R}$. Optionally, the points may each belong to one of $M$ groups, denoted $G_1,\dots,G_M$, which form a partition of $\mathcal{X}$. The number of points in group $G_i$ is denoted $n_i$. We use $\bar{x}$ to denote the mean of the points in $\mathcal{X}$, and $B_r(x)$ to denote a ball of radius $r$ centered on a given point $x\in\mathcal{X}$.