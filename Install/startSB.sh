#!/bin/sh

cd /etc/openvpn/
sudo openvpn --config PrivateVPN-NL.ovpn --script-security 2 --up /etc/openvpn/up.sh
