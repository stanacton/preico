# PRE ICO Testnet

A testnet has been setup for the preico project.  The root node is setup at `` testnet.dpactum.io ``

## Connecting to the DPactum Testnet
1. Change directory to the project directory.
1. SSH into the Vagrant machine `` vagrant ssh `` NOTE: If you get an error that the machine isn't running or provisioned run `` vagrant up ``
1. Change directory to `` cd ~/project-files/devnodes ``
1. (Optional if errors) Reset previous Geth data `` rm -rf ~/.ethereum/geth `` This will delete blockchain data, but keep accounts if you have any.
1. Import the genesis block data to your geth node. `` geth init genesis.json ``
1. Create accounts if you haven't already. `` geth account new `` and follow the instructions.
1. Start your local Ethereum geth node by `` ./peer/join-testnet.sh `` OR `` ~/project-files/devnodes/peer/join-testnet.sh `` to run in the background `` nohup ./peer/join-testnet.sh & `` then ctrl+c to escape.


