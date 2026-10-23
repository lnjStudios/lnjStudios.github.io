---
title: micro-ROS on an ESP32, the PlatformIO way
description: A three-part guide on Links & Docs to getting an ESP32 talking to ROS 2 Jazzy with micro-ROS, set up, explained and debugged.
date: 2025-12-06
type: post
categories: [Notes]
tags: [micro-ros, esp32, platformio, ros2]
stage: stable
level: intermediate
author: [koustav]
---

Getting a microcontroller to talk to ROS 2 is one of those jobs that should take an afternoon and usually takes a week. I wrote up the path that worked for me as a three-part series on Links & Docs:

1. **[Setup](https://docs.lnjstudios.com/docs/microros/microros-setup/)**: micro-ROS for Arduino through PlatformIO in VS Code, plus the micro-ROS agent on a machine running ROS 2 Jazzy.
2. **[Code breakdown](https://docs.lnjstudios.com/docs/microros/microros-pio-code-breakdown/)**: a boilerplate for a full node structure (publishers, subscribers, timers) that you can build on.
3. **[Troubleshooting](https://docs.lnjstudios.com/docs/microros/microros-troubleshooting/)**: every problem we hit along the way, and how we got past it.

Why PlatformIO and not the Arduino IDE or ESP-IDF directly? It's the easiest to set up and keeps the library versions pinned per project, which matters a lot with micro-ROS.
