#!/bin/bash
set -e

plist="com.goodbye.daemon.plist"

mkdir -p /var/log/goodbye

launchctl unload ~/Library/LaunchAgents/$plist && \
cp "$(pwd)"/$plist ~/Library/LaunchAgents/ && \
launchctl load ~/Library/LaunchAgents/$plist
