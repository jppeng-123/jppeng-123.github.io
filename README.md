🚀 JP Peng
Quantitative Research · Systematic Trading · Risk Analytics
🧭 Overview

This repository hosts the professional portfolio site and serves as a structured archive of work in:

systematic alpha research

volatility and risk modeling

portfolio construction

production trading infrastructure

Primary focus: building production-grade quantitative pipelines that translate statistical evidence into deployable investment decisions, with emphasis on:

robustness

interpretability

realistic execution assumptions

disciplined risk control

—not backtest optimization.

🔗 Live site
https://jppeng-123.github.io/




🧠 Research Philosophy

Markets reward process consistency rather than isolated performance.

Core principles:

statistical validity over in-sample results

out-of-sample robustness over model complexity

risk management over return maximization

Standard research workflow:

Walk-forward training
→ strict holdout testing
→ cross-sectional neutralization
→ transaction cost modeling
→ liquidity-aware execution

Objective: strategies designed for live deployment, not historical fit.




📚 Research Domains
📈 Systematic Equity & Factor Research

Development and validation of cross-sectional alpha signals.

Methods:

Information Coefficient screening

LASSO / Ridge regularization

Genetic Algorithm factor discovery

Barra-style risk neutralization

Walk-forward backtesting

Newey-West HAC statistical inference

Focus:

stable signals

controlled turnover

deployable exposures

minimized overfitting

🌪 Volatility & Risk Modeling

Construction of forward-looking risk and uncertainty frameworks.

Methods:

GARCH / EGARCH volatility forecasting

Hidden Markov regime detection

Monte Carlo scenario simulation

Value-at-Risk / Expected Shortfall

portfolio stress testing

Focus:

distribution-aware modeling

regime sensitivity

tail risk control

drawdown stability




⚖️ Portfolio Construction & Optimization

Practical portfolio engineering under realistic constraints.

Methods:

softmax weighting

risk parity allocation

PCA factor decomposition

transaction cost modeling

liquidity filters

Focus:

capital efficiency

scalable execution

stable exposures

implementation feasibility




🔬 Recent Development Focus
🧬 Walk-Forward Genetic Algorithm Alpha Platform

Industry-grade automated alpha discovery and validation framework.

Architecture:

rolling multi-year walk-forward training schedule

strict holdout evaluation

time-ordered train/validation splits with purge gaps

LASSO pre-selection of candidate features

symbolic factor generation via Genetic Programming

complexity penalties to reduce overfitting

Barra-style neutralization

Newey-West t-stat inference on daily IC

transaction-cost-aware rolling backtests

Purpose:

systematic factor discovery

reproducible research process

statistically defensible signals

production-ready deployment




🛠 Technical Stack
Programming

Python · NumPy · Pandas · Numba · scikit-learn · statsmodels · matplotlib

Infrastructure

Bloomberg · SQL · data pipelines · large-scale backtesting systems

Methods

Time-series modeling · cross-sectional econometrics · machine learning · stochastic simulation · optimization




📊 Portfolio Scope

This portfolio represents:

research structure

modeling standards

statistical discipline

execution realism

production readiness

Designed to reflect professional quantitative research practices rather than academic prototypes.




🤝 Contact

Email
jinjia.peng1122@gmail.com

GitHub
https://github.com/jppeng-123

LinkedIn
https://www.linkedin.com/in/jinjiapeng/
