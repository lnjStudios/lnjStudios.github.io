---
title: 'Polygon Editor: draw coverage zones in RViz'
description: An RViz 2 tool and panel for drawing and editing coverage-area polygons on a map, then sending them straight to the Nav2 coverage server.
date: 2026-10-06
type: post
categories: [Tools]
tags: [ros2, rviz, nav2, coverage]
stage: prototype
level: intermediate
links:
  - {label: Source & issues, url: 'https://github.com/koustavbetal/rviz_plugins'}
  - {label: opennav_coverage, url: 'https://github.com/open-navigation/opennav_coverage'}
author: [koustav]
---

Telling a cleaning or mowing robot *where* to cover usually means typing polygon coordinates into a YAML file and hoping you got them right. **Polygon Editor** lets you draw the zone on the map in RViz instead.

## What it does

- **Polygon Edit tool:** click in the RViz scene to drop vertices; drag the interactive markers to adjust them.
- **Polygon Editor panel:** New, Clear, Undo, and **Send to coverage server**.
- **Saves and loads zones** as a YAML file, so a zone you drew yesterday is still there today.
- **Sends the polygon to [opennav_coverage](https://github.com/open-navigation/opennav_coverage)** (the Nav2 complete-coverage server) as a `ComputeCoveragePath` goal, and you get the coverage path back.

## Try it

It's a regular ROS 2 package that builds alongside `opennav_coverage` and Fields2Cover in a colcon workspace. The included launch file brings up a map server, the coverage server and RViz with the tool loaded:

```bash
ros2 launch polygon_editor map_launcher.launch.py map:=/path/to/your_map.yaml
```

## Status

Early days. It works end to end on my maps, but expect rough edges.
