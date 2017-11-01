#!/bin/bash

sudo apt-get update
sudo apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common git

/vagrant/scripts/install-docker.sh
/vagrant/scripts/install-golang.sh

# Install NodeJS
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo npm install -g npm 

/vagrant/scripts/dev-tools.sh 


