---
title: Koustav Betal
description: Robotics software and sensor fusion engineer, building autonomous mobile robots from hardware bring-up to full ROS 2 deployment.
layout: resume
url: /koustav/           # the author page's address (it's the `koustav` term of the `author` taxonomy)
# Author profile + résumé (layouts/_default/resume.html); posts with `author: [koustav]` link here and are listed
# at the end. Everything on this page comes from here. Lists can grow or shrink; a section
# with nothing in it isn't shown. Kept in step with the PDF CV.
photo: koustav.png          # the profile picture, used as is
avatar: https://github.com/koustavbetal.png   # the small round picture in post bylines
role: Robotics Software & Sensor Fusion Engineer
tagline: I lead embedded and navigation software for autonomous mobile robots, from founding-stage hardware bring-up to full ROS 2 deployment.
# the hero buttons and the "Get in touch" row; the first one is the main (filled) button
contact:
  - {label: Email, url: 'mailto:koustavbetal.official@gmail.com', icon: email}
  - {label: LinkedIn, url: 'https://linkedin.com/in/koustavbetal', icon: linkedin}
  - {label: GitHub, url: 'https://github.com/koustavbetal', icon: github}
  - {label: WhatsApp, url: 'https://wa.me/917595847937', icon: whatsapp, print: '+91 7595847937'}
# primary skills: the big chips right under the hero
core: [ROS 2 · Nav2, C++, Python, Sensor fusion, SLAM, Embedded firmware (ESP32 · STM32)]
experience:
  - role: Lead Robotics Engineer
    org: Soma Specialities Pvt. Ltd.
    from: Aug 2025
    to: Present
    note: Founding engineering team member · Autonomous industrial floor-cleaning robot
    points:
      - Leading hardware selection, software architecture and motion / navigation software for a commercial autonomous cleaning robot, from the ground up.
      - Built multi-sensor fusion for obstacle and glass detection (ultrasonic, LiDAR, depth cameras) feeding a custom Nav2 costmap layer, for reliable perception in mixed indoor environments.
      - Implemented the full ROS 2 Nav2 stack (SLAM, auto-localisation, custom path planning) for full-area cleaning routes.
      - Wrote a C++ multistage mission system orchestrator coordinating coverage, navigation, obstacle avoidance and auto-docking; debugged real-time timing and race conditions across the stack.
      - Fully tuned multiple safety features and made it reliable to a 100% human safe.
  - role: R&D Engineer Intern
    org: Together Solutions Robotics & AI
    url: 'https://togethersolutions.co.in/'
    from: Jan 2025
    to: Jul 2025
    points:
      - Designed and prototyped drones and ROVs for real-time industrial inspection, contributing to work that generated over 45% of the company's revenue.
      - Built ROS 2 / Gazebo simulation environments and control pipelines; contributed to the modular software architecture of autonomous patrolling robots for industrial surveillance.
  - role: Automation Engineer Trainee
    org: Premium Industrial Solutions Pvt. Ltd.
    from: Aug 2024
    points:
      - Hands-on with VFDs, relay switching and industrial automation components.
  - role: Robotics Trainee
    org: Inspecto3D
    from: Jul 2024
    points:
      - Designed and built an autonomous industrial security robot on an NVIDIA Jetson Nano with AI face detection and visual SLAM, backed by AWS EC2.
  - role: Robotics Trainee
    org: Think Again Lab
    from: Jun 2023
    to: Jul 2023
    points:
      - Built a 3-DOF robotic arm with motion-imitation control, and a 500 × 500 mm 2D CNC plotter from scratch.
projects:
  - {title: Night Patrolling Robot for Women's Safety, text: 'University project: an autonomous robot using stereo vision, a mic array, ROS 2 and LiDAR for anomaly detection, sending real-time photo and location alerts to first responders.'}
  - {title: Edge Voice Assistant for Robot Interaction, text: 'A complete working openWakeWord - STT-TTS along with llama.cpp local LLM inference tuned for edge devices.'}
  - {title: Shard: A lightweight fully Autonomous Mobile Robot, text: 'A small differential-drive assistant robot of my own, built to roam around the room.'}
# side projects: `page` pulls the title, description and stage from a page on this site
side:
  - {page: /tools/ros-manager}
  - {title: Links & Docs, url: 'https://docs.lnjstudios.com/', text: 'Step-by-step robotics guides I write and maintain: micro-ROS on an ESP32, a ROS 2 robot with ros2_control and Nav2, and the basics.'}
skills:
  - {group: Languages, items: [C, C++, Python, Embedded C, MicroPython]}
  - {group: Robotics / ROS, items: [ROS2, Nav2, MoveIt2, SLAM, V-SLAM, motion planning,]}
  - {group: Simulators, items: [Gazebo, CoppeliaSim, MuJoCo (mjlab)]}
  - {group: Sensor fusion & perception, items: [LiDAR, Ultrasonic, RGBD Camera, stereo vision, IR Camera, Wheel Odometry]}
  - {group: AI / computer vision, items: [PyTorch, TensorFlow, OpenCV, MediaPipe, image segmentation, monocular depth estimation]}
  - {group: Embedded & communication, items: [ESP32, STM32, UART, CAN / CANopen, I2C, SPI, MQTT, Zigbee]}
  - {group: Systems, items: [Linux (Ubuntu), systemd, Git]}
  - {group: Design & automation, items: [SolidWorks, Onshape, CoppeliaSim, Simatic PLC, SCADA, HMI]}
education:
  - {degree: 'B.Tech in Robotics & Automation', org: The Neotia University, from: Sep 2021, to: Jul 2025, note: 'CGPA 9.20 / 10'}
achievements:
  - Top 30, e-Yantra Robotics Competition (GeoGuide theme), 2023–24 · Level 2 certified, India-wide.
  - Quadcopter build, test, calibration and flight (ArduPilot, Pixhawk Orange Cube) · Inspecto3D.
  - ROS 2 for Beginners (Humble) and Level 2 (TF, URDF, RViz, Gazebo) · Udemy.
  - Coordinator, IEEE IAS GlobConPT 2022.
---

Robotics engineer with hands-on experience leading embedded and navigation software for autonomous mobile robots, from founding-stage hardware bring-up to full ROS 2 deployment. Strong in C++ and Python robotics software, multi-sensor fusion (LiDAR, ultrasonic, depth / IR cameras), embedded firmware on ESP32 and STM32, and serial / field-bus communication (CAN, RS, UART, I2C, SPI). Comfortable getting my hands dirty with system architecture and design, custom firmware, the navigation stack and field debugging.
