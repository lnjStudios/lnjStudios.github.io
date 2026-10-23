---
title: 'ROS-Manager: ROS 2 in one command'
description: From a fresh Ubuntu board to a working ROS 2, in one command. Picks the right distro, installs what you use, checks it works and wires up your shell.
date: 2026-10-18
type: post
categories: [Tools]
tags: [ros2, installer, bash, ubuntu]
stage: stable
level: beginner
license: MIT
links:
  - {label: Source & issues, url: 'https://github.com/koustavbetal/ros_manager'}
disclaimer: ROS is a trademark of Open Robotics. ROS-Manager is an independent project and is not affiliated with or endorsed by Open Robotics.
author: [koustav]
cover: cover.svg
banner: banner-dark.svg
alt: 'ROS Manager banner: fresh Ubuntu board to working ROS 2, in one command.'
---

**ROS-Manager** takes a fresh Ubuntu machine to a working ROS 2 install in one command. It picks the right distro for your Ubuntu, sets up the official apt source, installs ROS 2 plus the packages you actually use (Gazebo, MoveIt, Nav2, SLAM, ros2_control…), initialises rosdep, checks that it all works, and wires it into your shell.

It's a single bash file and only needs what Ubuntu already ships with, so it runs on a Raspberry Pi, a Jetson, a cloud VM or a desktop.

## Quick start

```bash
bash <(wget -qO- lnjstudios.com/ros-man)
```

With curl: `bash <(curl -fsSL lnjstudios.com/ros-man)`.

The interactive flow asks a few questions in place and shows exactly what it will do before it touches anything. If you already know what you want, skip the questions:

```bash
# a headless robot: ROS 2 base + Nav2 + SLAM + dev tools
bash <(wget -qO- lnjstudios.com/ros-man) -t base -w nav2,slam -d -y

# a workstation: Jazzy desktop, simulation, arm planning
bash <(wget -qO- lnjstudios.com/ros-man) -v jazzy -t desktop -w gazebo,moveit,urdf -d -y
```

Prefer to read it first? Download it, look, and dry-run it: `-n` runs the whole flow without changing anything.

```bash
wget -O ros-manager.bash lnjstudios.com/ros-man
less ros-manager.bash
bash ros-manager.bash -n
```

## What it does

1. **Shows what's there:** OS, CPU, memory, disk, your shell, any ROS 2 already installed, and the distros built for this Ubuntu. The distro list comes live from [rosdistro](https://github.com/ros/rosdistro), so new releases show up without updating the script.
2. **Asks, or follows your flags:** distro, desktop or headless, plugins, and any extra `ros-<distro>-*` package from a live search of the ROS repository.
3. **Installs:** locale, the official `ros2-apt-source`, ROS 2, your plugins and packages, then `rosdep`. Press `l` during the install for the live apt log.
4. **Checks it works:** a clean shell sources the setup file and runs `ros2`. If that fails, it offers to run the install steps again.
5. **Wires up your shell:** last of all, it asks before adding the `source` line to `~/.bashrc` or `~/.zshrc`.

Already have ROS 2? It won't blindly reinstall. You get a menu: add packages, replace the distro, install a second one in parallel, or remove it cleanly (rc file included).

## Supported systems

| Ubuntu | ROS 2 |
|---|---|
| 22.04 LTS | Humble Hawksbill |
| 24.04 LTS | Jazzy Jalisco, Kilted Kaiju |
| 26.04 LTS | Lyrical Luth, Rolling Ridley |

This is a snapshot; the script asks rosdistro at run time.

## What's next

1. **Installer** (this release)
2. Workspace templates: `robot_description`, `robot_control`, `robot_nav`…
3. URDF authoring
4. Joint testing and hardware bring-up with ros2_control
