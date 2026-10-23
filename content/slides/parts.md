---
url: /parts/
build:
  render: always # a real page (the slides around it are headless, see _index.md)
title: Parts I trust
description: The boards, drivers and sensors that have survived the LnJ bench. No affiliate links, no sponsors.
date: 2026-10-21
---

These are parts I've actually built with, and they're what my guides assume. Nobody pays me to list them and none of the links earn me anything. Prices move a lot, so there are none here.

## Brains

- **ESP32-S3 DevKitC-1 (N16R8)**: my default microcontroller for micro-ROS nodes. Plenty of flash and PSRAM, native USB, and it's what the [micro-ROS guide](https://docs.lnjstudios.com/docs/microros/microros-setup/) is written against.
- **ESP32 DevKit V1 (DOIT)**: the cheap, everywhere classic. Fine for simple nodes and sensor tests.

## Motion

- **TB6612FNG dual motor driver**: small DC motors on a budget, driven straight from an ESP32.

## Sensing and display

- **BMP280**: pressure and temperature over I2C; a good first sensor to test a new board with.
- **SH1106 / SSD1306 OLEDs (u8g2)**: a tiny screen for status and debug output on the robot itself.
- **Ultrasonic distance sensor**: crude, but enough for a first obstacle-stop node.

## Software I always reach for

- **[PlatformIO](https://platformio.org/)**: pins library versions per project, which matters a lot with micro-ROS.
- **[ROS-Manager]({{< relref "tools/ros-manager" >}})**: to get ROS 2 onto a fresh board in one command.

Got a part you'd like me to try, or a gotcha I missed? [Tell me](https://github.com/lnjStudios/lnjStudios.github.io/issues/new?template=guide-request.yml).
