#!/bin/bash

echo
echo "#docker container delete"
docker rm -f $(docker ps -aq)

echo
echo "#docker images delete"
docker rmi -f $(docker images dev-* -q)

echo
echo "#docker networ delete"
docker network prune -f
docker ps -a

cd basic-network

./start.sh

echo
docker-compose -f docker-compose.yml up -d cli

cd ..

echo
echo "#Chain Code Install"
docker exec cli peer chaincode install -n sacc -v 1.0 -p github.com/sacc
sleep 1
docker exec cli peer chaincode list --installed

echo
echo "#Chain Code Instantiate"
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n sacc -v 1.0 -c '{"Args":["a","10"]}' -P "OR('Org1MSP.member','Org2MSP.member')"
sleep 1
docker exec cli peer chaincode list --instantiated -C mychannel

echo
echo "#Create Wallet"
if [ ! -d "node_modules" ]; then
       npm install
fi
rm -rf wallet
node enrollAdmin.js
node registerUser.js
