import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
  }

  async loadWeb3() {
    if(typeof window.ethereum!=='undefined' && !this.state.wrongNetwork){
      let accounts, network, balance, web3, maxBet, minBet, contract, contract_abi, contract_address

      // Don't refresh DApp when user change the network
      window.ethereum.autoRefreshOnNetworkChange = false;

      web3 = new Web3(window.ethereum)
      this.setState({web3: web3})

      contract_abi = [{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "sender","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Received","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "bet","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "randomSeed","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"},{"indexed": false,"internalType": "address","name": "player","type": "address"},{"indexed": false,"internalType": "uint256","name": "winAmount","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "randomResult","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "time","type": "uint256"}],"name": "Result","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "admin","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [{"internalType": "uint256","name": "bet","type": "uint256"},{"internalType": "uint256","name": "seed","type": "uint256"}],"name": "game","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"},{"internalType": "uint256","name": "randomness","type": "uint256"}],"name": "rawFulfillRandomness","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bytes32","name": "_keyHash","type": "bytes32"},{"internalType": "uint256","name": "_fee","type": "uint256"},{"internalType": "uint256","name": "_seed","type": "uint256"}],"name": "requestRandomness","outputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"}],"stateMutability": "nonpayable","type": "function"},{"stateMutability": "payable","type": "receive"},{"inputs": [{"internalType": "uint256","name": "random","type": "uint256"}],"name": "verdict","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "withdrawEther","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "withdrawLink","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [],"name": "admin","outputs": [{"internalType": "address payable","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "ethInUsd","outputs": [{"internalType": "int256","name": "","type": "int256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "gameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "games","outputs": [{"internalType": "uint256","name": "id","type": "uint256"},{"internalType": "uint256","name": "bet","type": "uint256"},{"internalType": "uint256","name": "seed","type": "uint256"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "address payable","name": "player","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "lastGameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"name": "nonces","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "randomResult","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "weiInUsd","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}]
      contract_address = '0x37465edC8d70E4b16033fAe23088b1c703924A80' //rinkeby
      contract = new web3.eth.Contract(contract_abi, contract_address);
      accounts = await web3.eth.getAccounts()
      
      // Update the data when user initially connect
      if(typeof accounts[0]!=='undefined' && accounts[0]!==null) {
        balance = await web3.eth.getBalance(accounts[0])
        maxBet = await web3.eth.getBalance(contract_address)
        minBet = await contract.methods.weiInUsd().call()
        this.setState({account: accounts[0], balance: balance, minBet: minBet, maxBet: maxBet})
      }

      this.setState({
        contract: contract,
        contractAddress: contract_address
      })

      // Update account&balance when user change the account
      window.ethereum.on('accountsChanged', async (accounts) => {
        if(typeof accounts[0] !== 'undefined'  && accounts[0]!==null){
          balance = await web3.eth.getBalance(accounts[0])
          maxBet = await web3.eth.getBalance(contract_address)
          minBet = await contract.methods.weiInUsd().call()
          
          this.setState({account: accounts[0], balance: balance, minBet: minBet, maxBet: maxBet})
        } else {
          this.setState({account: null, balance: 0})
        }
      });

      // Update data when user switch the network
      window.ethereum.on('chainChanged', async (chainId) => {
        network = parseInt(chainId, 16)
        if(network!==4){
          this.setState({wrongNetwork: true})
        } else {
          if(this.state.account){
            balance = await this.state.web3.eth.getBalance(this.state.account)
            maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress)
            minBet = await this.state.contract.methods.weiInUsd().call()
            
            this.setState({ balance: balance, maxBet: maxBet, minBet: minBet })
          }
          this.setState({ network: network, loading: false, onlyNetwork: false, wrongNetwork: false})
        }
      });
    }
  }


  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;