import dice_logo from "../../assets/dice_logo.png";
import React, { Component } from "react";
import dice from "../../assets/eth.png";
import eth from "../../assets/eth.png";
import FadeIn from "react-fade-in";
import Popup from "react-popup";
import "../App.css";

class Main extends Component {
  render() {
    return (
      <FadeIn>
        <div
          className="container-fluid mt-5 col-m-4"
          style={{ maxWidth: "550px" }}
        >
          <div className="col-sm">
            <main
              role="main"
              className="col-lg-12 text-monospace text-center text-light"
            >
              <div className="content mr-auto ml-auto">
                <div id="content" className="mt-3">
                  <div className="card mb-4">
                    <div className="card-body">
                      <div>
                        <img src={dice} width="225" alt="logo" />
                      </div>
                      &nbsp;
                      <p></p>
                      <div className="input-group mb-4">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-control-md"
                          placeholder="bet amount..."
                          onChange={(e) => this.props.onChange(e.target.value)}
                          required
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <img src={eth} height="20" alt="" />
                            &nbsp;<b>ETH</b>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn low btn-sm"
                        onClick={(event) => {
                          event.preventDefault();
                          // Start with digit, digit+dot* or single dot*, end with digit.
                          var reg = new RegExp("^[0-9]*.?[0-9]+$");

                          if (reg.test(this.props.amount)) {
                            const amount = this.props.amount.toString();
                            this.props.makeBet(
                              0,
                              this.props.web3.utils.toWei(amount)
                            );
                          } else {
                            Popup.alert(
                              "Please type positive interger or float numbers"
                            );
                          }
                        }}
                      >
                        Low
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        type="submit"
                        className="btn high btn-sm"
                        onClick={(event) => {
                          event.preventDefault();
                          // Start with digit, digit+dot* or single dot*, end with digit.
                          var reg = new RegExp("^[0-9]*.?[0-9]+$");
                          var minBet = Number(
                            this.props.web3.utils.fromWei(
                              this.props.minBet.toString()
                            )
                          ).toFixed(5);

                          if (
                            reg.test(this.props.amount) &&
                            this.props.amount >= minBet
                          ) {
                            const amount = this.props.amount.toString();
                            this.props.makeBet(
                              1,
                              this.props.web3.utils.toWei(amount)
                            );
                          } else {
                            Popup.alert(
                              "Please make sure that:\n*You typed positive interger or float number\n* Typed value is >= than MinBet (not all ETH decimals visible)\n* You are using Rinkeby network"
                            );
                          }
                        }}
                      >
                        High
                      </button>
                    </div>
                    <div className="numbers">
                      {!this.props.balance ? (
                        <div
                          id="loader"
                          className="spinner-border fix float-right"
                          role="status"
                        ></div>
                      ) : (
                        <div
                          className="float-right"
                          style={{
                            width: "220px",
                            padding: "7px",
                            color: "#5c646c",
                          }}
                        >
                          <div
                            className="float-left font-left"
                            style={{ height: "17px" }}
                          >
                            <b>MaxBet: </b>
                          </div>
                          <div
                            className="float-right"
                            style={{ height: "17px" }}
                          >
                            {Number(
                              this.props.web3.utils.fromWei(
                                this.props.maxBet.toString()
                              )
                            ).toFixed(5)}{" "}
                            <b>ETH </b>
                          </div>
                          <br></br>
                          <div
                            className="float-left font-left"
                            style={{ height: "17px" }}
                          >
                            <b>MinBet: </b>
                          </div>
                          <div
                            className="float-right"
                            style={{ height: "17px" }}
                          >
                            {Number(
                              this.props.web3.utils.fromWei(
                                this.props.minBet.toString()
                              )
                            ).toFixed(5)}{" "}
                            <b>ETH </b>
                          </div>
                          <br></br>
                          <div className="float-left font-left">
                            <b>Balance: </b>
                          </div>
                          <div className="float-right">
                            {Number(
                              this.props.web3.utils.fromWei(
                                this.props.balance.toString()
                              )
                            ).toFixed(5)}{" "}
                            <b>ETH </b>
                          </div>
                        </div>
                      )}
                      <div className="dice2">
                        <img src={dice_logo} width="80" alt="logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </FadeIn>
    );
  }
}

export default Main;
