---
title: October 2026 at a glance
description: ROS-Manager v2 shipped, a new RViz plugin for coverage zones got started, and this site moved house.
date: 2026-10-21
type: post
categories: [Notes]
tags: [monthly, ros2]
stage: stable
author: [koustav]
---

A short log of what came off the bench this month.

## ROS-Manager v2 is out

v2 is a full rewrite of the installer and went public on 16 October, followed by a round of UX fixes on the 18th. The big changes from v1: the distro list now comes live from rosdistro instead of a hard-coded table, there's a searchable plugin browser for any `ros-<distro>-*` package, it checks that ROS 2 actually runs before touching your `~/.bashrc`, and it won't blindly reinstall if you already have ROS 2. Details and the install command are on the [ROS-Manager page]({{< relref "tools/ros-manager" >}}).

## Started: Polygon Editor

Drawing coverage zones for a cleaning robot by typing coordinates into YAML got old fast, so I started an RViz 2 plugin to draw them on the map instead. The first week got it saving zones to YAML, loading them back, and sending them to the Nav2 coverage server. It's early; more on the [Polygon Editor page]({{< relref "tools/polygon-editor" >}}).

## This site moved

The old site was a SaaS landing-page template, with pricing tables and job openings for a studio that is one person and a workbench. It's now simpler: **Tools** for the software I've released, **Notes** for short posts like this one, and the long-form guides stay on [Links & Docs](https://docs.lnjstudios.com/).
