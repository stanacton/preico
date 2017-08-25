#!/bin/bash


curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
tar xvf go1.6.linux-amd64.tar.gz
sudo chown -R root:root ./go
sudo mv go /usr/local
mkdir /home/vagrant/gopath
sudo echo export GOPATH=$HOME/gopath  >> /home/vagrant/.profile
sudo echo export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin  >> /home/vagrant/.profile

rm -rf ./go 
rm -f go1.6.linux-amd64.tar.gz
