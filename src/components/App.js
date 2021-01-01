import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import { getChain } from "evm-chains";
import Web3Modal from "web3modal";
import Popup from "react-popup";
import Loading from "./Loading";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";

class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
  }

  async loadWeb3() {
    // Declare WalletConnect
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: "https://eth-rinkeby.alchemyapi.io/v2/afClZ-OJFla42E2o2BWVpYFFd7Ta0hol", // MBrassey
          /* infuraId: "db6231b5ef424bd9a61a76670e56086b", // MBrassey */
        },
      },
    };
    
    var web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
      disableInjectedProvider: false, // Declare MetaMask
    });

    this.setState({ web3Modal: web3Modal });

    // Settings for only MetaMask
    if (typeof window.ethereum !== "undefined") {
      let network, balance, web3;

      window.ethereum.autoRefreshOnNetworkChange = false;
      web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });

      // Update address & account when MM user change account
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (typeof accounts[0] === "undefined") {
          this.setState({ account: null, balance: null, provider: null });
        } else if (this.state.provider === null) {
          this.setState({ account: null, balance: null, loading: true });
          balance = await web3.eth.getBalance(accounts[0]);
          this.setState({
            account: accounts[0],
            balance: balance,
            loading: false,
          });
        }
      });

      window.ethereum.on("chainChanged", async (chainId) => {
        this.setState({
          network: null,
          balance: null,
          loading: true,
          onlyNetwork: true,
        });

        if (this.state.account) {
          balance = await web3.eth.getBalance(this.state.account);
          this.setState({ balance: balance });
        }

        network = await getChain(parseInt(chainId, 16));
        this.setState({
          network: network.network,
          loading: false,
          onlyNetwork: false,
        });
      });
    }

    if (typeof window.ethereum !== "undefined" && !this.state.wrongNetwork) {
      let accounts,
        network,
        balance,
        web3,
        maxBet,
        minBet,
        contract,
        contract_abi,
        contract_address;

      // Don't refresh DApp when user changes the network
      window.ethereum.autoRefreshOnNetworkChange = false;

      web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });

      contract_abi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Received",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bet",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "randomSeed",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "winAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "randomResult",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "time",
              type: "uint256",
            },
          ],
          name: "Result",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Withdraw",
          type: "event",
        },
        {
          inputs: [
            { internalType: "uint256", name: "bet", type: "uint256" },
            { internalType: "uint256", name: "seed", type: "uint256" },
          ],
          name: "game",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "requestId", type: "bytes32" },
            { internalType: "uint256", name: "randomness", type: "uint256" },
          ],
          name: "rawFulfillRandomness",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes32", name: "_keyHash", type: "bytes32" },
            { internalType: "uint256", name: "_fee", type: "uint256" },
            { internalType: "uint256", name: "_seed", type: "uint256" },
          ],
          name: "requestRandomness",
          outputs: [
            { internalType: "bytes32", name: "requestId", type: "bytes32" },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        { stateMutability: "payable", type: "receive" },
        {
          inputs: [
            { internalType: "uint256", name: "random", type: "uint256" },
          ],
          name: "verdict",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "withdrawEther",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "withdrawLink",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        { inputs: [], stateMutability: "nonpayable", type: "constructor" },
        {
          inputs: [],
          name: "admin",
          outputs: [
            { internalType: "address payable", name: "", type: "address" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "ethInUsd",
          outputs: [{ internalType: "int256", name: "", type: "int256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "gameId",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          name: "games",
          outputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "bet", type: "uint256" },
            { internalType: "uint256", name: "seed", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "address payable",
              name: "player",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastGameId",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          name: "nonces",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "randomResult",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "weiInUsd",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ];
      contract_address = "0x37465edC8d70E4b16033fAe23088b1c703924A80"; // TossUp Contract Address (Rinkibe)
      contract = new web3.eth.Contract(contract_abi, contract_address);
      accounts = await web3.eth.getAccounts();

      // Update the data when user initially connect
      if (typeof accounts[0] !== "undefined" && accounts[0] !== null) {
        balance = await web3.eth.getBalance(accounts[0]);
        maxBet = await web3.eth.getBalance(contract_address);
        minBet = await contract.methods.weiInUsd().call();
        this.setState({
          account: accounts[0],
          balance: balance,
          minBet: minBet,
          maxBet: maxBet,
        });
      }

      this.setState({
        contract: contract,
        contractAddress: contract_address,
      });

      // Update account & balance when user changes the account
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (typeof accounts[0] !== "undefined" && accounts[0] !== null) {
          balance = await web3.eth.getBalance(accounts[0]);
          maxBet = await web3.eth.getBalance(contract_address);
          minBet = await contract.methods.weiInUsd().call();

          this.setState({
            account: accounts[0],
            balance: balance,
            minBet: minBet,
            maxBet: maxBet,
          });
        } else {
          this.setState({ account: null, balance: 0 });
        }
      });

      // Update data when user changes the network
      window.ethereum.on("chainChanged", async (chainId) => {
        network = parseInt(chainId, 16);
        if (network !== 4) {
          this.setState({ wrongNetwork: true });
        } else {
          if (this.state.account) {
            balance = await this.state.web3.eth.getBalance(this.state.account);
            maxBet = await this.state.web3.eth.getBalance(
              this.state.contractAddress
            );
            minBet = await this.state.contract.methods.weiInUsd().call();

            this.setState({ balance: balance, maxBet: maxBet, minBet: minBet });
          }
          this.setState({
            network: network,
            loading: false,
            onlyNetwork: false,
            wrongNetwork: false,
          });
        }
      });
    }
  }

  // Connect button, selecting provider via Web3Modal
  async on(event) {
    event.preventDefault();

    // Restore provider session
    await this.state.web3Modal.clearCachedProvider();
    let provider, account, network, balance, web3;

    try {
      // Activate windows with providers (MM and WC) choice
      provider = await this.state.web3Modal.connect();
      console.log("Provider: ", provider);

      this.setState({ loading: true, provider: null });

      if (provider.isMetaMask) {
        // When MetaMask was chosen as a provider
        account = provider.selectedAddress;
        network = await getChain(parseInt(provider.chainId, 16));
        web3 = new Web3(provider);
        balance = await web3.eth.getBalance(provider.selectedAddress);
      } else if (provider.wc) {
        // When WalletConect was chosen as a provider
        if (provider.accounts[0] !== "undefined") {
          account = await provider.accounts[0];
          network = await getChain(provider.chainId);
          web3 = new Web3(
            new Web3.providers.HttpProvider(
              `https://${network.network}.alchemyapi.io/v2/afClZ-OJFla42E2o2BWVpYFFd7Ta0hol` // MBrassey
            )
          );
          balance = await web3.eth.getBalance(account);
        } else {
          // Handle problem with providing data
          account = null;
          network = null;
          balance = null;
          web3 = new Web3(
            new Web3.providers.HttpProvider(
              `https://${network}.alchemyapi.io/v2/afClZ-OJFla42E2o2BWVpYFFd7Ta0hol` // MBrassey
            )
          );
        }
      } else {
        Popup.alert("Error, provider not recognized");
      }

      this.setState({
        web3: web3,
        loading: false,
        account: account,
        balance: balance,
        provider: provider,
        network: network.network,
      });
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Update account & balance
    provider.on("accountsChanged", async (accounts) => {
      let account, balance, network, web3;

      this.setState({ account: null, balance: null, loading: true });

      if (provider.isMetaMask && provider.selectedAddress !== null) {
        web3 = new Web3(provider);
        balance = await web3.eth.getBalance(provider.selectedAddress);
      } else if (provider.wc) {
        account = provider.accounts[0];
        network = await getChain(provider.chainId);
        web3 = new Web3(
          new Web3.providers.HttpProvider(
            `https://${network.network}.alchemyapi.io/v2/afClZ-OJFla42E2o2BWVpYFFd7Ta0hol`
          )
        );
        balance = await web3.eth.getBalance(account);
      }

      this.setState({ account: accounts[0], balance: balance, loading: false });
    });

    // Update network
    provider.on("chainChanged", async (chainId) => {
      let account, balance, network, web3;
      this.setState({ balance: null, network: null, loading: true });
      if (provider.isMetaMask && provider.selectedAddress !== null) {
        web3 = new Web3(provider);
        balance = await web3.eth.getBalance(provider.selectedAddress);
        network = await getChain(parseInt(provider.chainId, 16));
      } else if (provider.wc) {
        account = provider.accounts[0];
        network = await getChain(chainId);
        web3 = new Web3(
          new Web3.providers.HttpProvider(
            `https://${network.network}.alchemyapi.io/v2/afClZ-OJFla42E2o2BWVpYFFd7Ta0hol`
          )
        );
        balance = await web3.eth.getBalance(account);
        this.setState({
          balance: balance,
          network: network.network,
          loading: false,
        });
      } else if (provider.selectedAddress === null) {
        network = await getChain(parseInt(provider.chainId, 16));
        this.setState({ network: network.network, loading: false });
      }

      this.setState({
        balance: balance,
        network: network.network,
        loading: false,
      });
    });
  }

  // Disconnect button
  async off(event) {
    event.preventDefault();

    if (
      this.state.provider === null ||
      typeof this.state.provider === "undefined"
    ) {
      Popup.alert("Click: MetaMask > Account Options"+"> Connected Sites > Disconnect"); // Inform to disconnect from MetaMask
    } else {
      if (this.state.provider !== null && this.state.provider.wc) {
        await this.state.provider.stop(); // Disconnect Web3Modal+WalletConnnect (QR code remains)
        this.setState({ account: null, balance: null });

        // If MetaMask is installed
        if (window.ethereum) {
          const network = await getChain(parseInt(window.ethereum.chainId, 16));
          this.setState({ network: network.network });
        } else {
          this.setState({ network: null });
        }
      } else if (
        this.state.provider !== null &&
        this.state.provider.isMetaMask
      ) {
        await this.state.provider.close; // Disconnect Web3Modal+MetaMask
      }
      // Reset UI
      this.setState({ provider: null });

      // Restart provider session
      await this.state.web3Modal.clearCachedProvider();
    }
  }

  async offQr(event) {
    event.preventDefault();

    if (this.state.provider.wc) {
      await this.state.provider.disconnect();
      this.setState({
        account: null,
        balance: null,
        provider: null,
      });
      if (window.ethereum) {
        const network = await getChain(parseInt(window.ethereum.chainId, 16));
        this.setState({ network: network.network });
      } else {
        this.setState({ network: null });
      }
    }
  }

  // Bet
  async makeBet(bet, amount) {
    // RandomSeed - one of the components from which will be generated final random value
    const networkId = await this.state.web3.eth.net.getId();
    if (networkId !== 4) {
      this.setState({ wrongNetwork: true });
    } else if (
      typeof this.state.account !== "undefined" &&
      this.state.account !== null
    ) {
      var randomSeed = Math.floor(Math.random() * Math.floor(1e9));

      // Send bet to the contract and wait for the verdict
      this.state.contract.methods
        .game(bet, randomSeed)
        .send({ from: this.state.account, value: amount })
        .on("transactionHash", (hash) => {
          this.setState({ loading: true });
          this.state.contract.events.Result({}, async (error, event) => {
            const verdict = event.returnValues.winAmount;
            if (verdict === "0") {
              Popup.alert("You Lost!");
            } else {
              Popup.alert("You Won!");
            }

            // Prevent error when user logout, while waiting for the verdict
            if (
              this.state.account !== null &&
              typeof this.state.account !== "undefined"
            ) {
              const balance = await this.state.web3.eth.getBalance(
                this.state.account
              );
              const maxBet = await this.state.web3.eth.getBalance(
                this.state.contractAddress
              );
              this.setState({ balance: balance, maxBet: maxBet });
            }
            this.setState({ loading: false });
          });
        })
        .on("error", (error) => {
          Popup.alert("Error");
        });
    } else {
      Popup.alert("Problem with account or network");
    }
  }

  onChange(value) {
    this.setState({ amount: value });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: null,
      amount: null,
      balance: null,
      contract: null,
      event: null,
      loading: false,
      network: null,
      maxBet: 0,
      minBet: 0,
      web3: null,
      wrongNetwork: false,
      contractAddress: null,
      provider: null,
      onlyNetwork: false,
    };

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.offQr = this.offQr.bind(this);
    this.makeBet = this.makeBet.bind(this);
    this.setState = this.setState.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <div>
        <ParticlesBg type="cobweb" bg={true} color="#2d93ca" />
        <Navbar
          on={this.on}
          off={this.off}
          account={this.state.account}
          loading={this.state.loading}
        />
        &nbsp;
        {this.state.wrongNetwork ? (
          <div className="container-fluid mt-5 text-monospace text-center mr-auto ml-auto">
            <div className="content mr-auto ml-auto">
              <h1>Please Connect to Rinkeby Network</h1>
            </div>
          </div>
        ) : this.state.loading ? (
          <Loading
            balance={this.state.balance}
            maxBet={this.state.maxBet}
            minBet={this.state.minBet}
            web3={this.state.web3}
          />
        ) : (
          <Main
            amount={this.state.amount}
            balance={this.state.balance}
            makeBet={this.makeBet}
            onChange={this.onChange}
            maxBet={this.state.maxBet}
            minBet={this.state.minBet}
            loading={this.state.loading}
            web3={this.state.web3}
          />
        )}
        <Popup />
      </div>
    );
  }
}

export default App;
