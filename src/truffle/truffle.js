module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    "staging": {
      network_id: "101010",
      host: "localhost",
      port: 8545 // custom private network
      // use default rpc settings
    },
  }
};
