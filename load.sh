#!/bin/bash
set -e

plist="com.goodbye.daemon.plist"
daemon_path="/Library/LaunchDaemons/$plist"

echo "Setting up LaunchDaemon (requires sudo)..."

# Create log directory with proper ownership
sudo mkdir -p /var/log/goodbye
sudo chown "$USER":staff /var/log/goodbye
sudo chmod 755 /var/log/goodbye

# Unload existing daemon if it exists
if [ -f "$daemon_path" ]; then
    echo "Unloading existing daemon..."
    sudo launchctl unload "$daemon_path" 2>/dev/null || true
fi

# Copy plist to system daemon location
echo "Installing daemon..."
sudo cp "$(pwd)/$plist" "$daemon_path"

# Set proper ownership and permissions for the daemon plist
sudo chown root:wheel "$daemon_path"
sudo chmod 644 "$daemon_path"

# Load the daemon
echo "Loading daemon..."
sudo launchctl load "$daemon_path"

echo "Done! Daemon installed and loaded."
echo "Check logs at: /var/log/goodbye/"
