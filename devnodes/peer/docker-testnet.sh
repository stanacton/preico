
docker run -it \
-p 9545:9545 \
-v ~/.ethereum:/.ethereum \
ethereum/client-go geth --networkid 101010 --bootnodes "enode://5decec2c85bccb7898371283f5cc85eb5d2f6460dfdd7dc5c63c3f1625e9c8b269a494e1725a60ab8e5d9f5727249407cd59ed12c938704036900f23c6425311@[35.176.40.247]:40303" --rpc --rpcport 8545 --rpcaddr localhost --rpcapi "eth,net,web3" --rpccorsdomain * --verbosity 6 --nat none  
