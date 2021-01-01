import dice_logo from "../../assets/dice_logo.png";
import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar fixed-top flex-md-nowrap p-0 shadow text-monospace">
        <a
          className="navbar-brand col-sm-3"
          href="http://brassey.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={dice_logo} height="40" alt="logo" /> TossUp
        </a>

        {/* Wallet Connection */}
        <ul className="navbar-nav px-3 text-white">
          {!this.props.account && !this.props.loading ? (
            <div className="row text-center text-monospace">
              <button
                type="submit"
                onClick={(e) => this.props.on(e)}
                className="btn btn-outline-success btn-sm"
                style={{ width: "125px", fontSize: "17px" }}
              >
                <b>Connect</b>
              </button>
              &nbsp;
            </div>
          ) : !this.props.account && this.props.loading ? (
            <div className="row text-center text-monospace">
              <button
                type="submit"
                className="btn btn-outline-success btn-sm"
                style={{ width: "125px", fontSize: "17px" }}
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Loading...</span>
              </button>
              &nbsp;
            </div>
          ) : (
            <div className="row text-center text-monospace">
              <button
                type="submit"
                onClick={(e) => this.props.off(e)}
                className="btn btn-outline-danger btn-sm"
                style={{ width: "125px", fontSize: "17px" }}
              >
                Disconnect
              </button>
              &nbsp;
            </div>
          )}
        </ul>

        {/* ETH Address */}
        {!this.props.account ? (
          <div
            id="loader"
            className="spinner-border text-light"
            role="status"
          ></div>
        ) : (
          <li className="nav-item text-nowrap d-sm-block">
            <a
              className="text-light"
              href={
                "https://rinkeby.etherscan.io/address/" + this.props.account
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.account}
            </a>{" "}
            &nbsp;
          </li>
        )}
      </nav>
    );
  }
}

export default Navbar;
