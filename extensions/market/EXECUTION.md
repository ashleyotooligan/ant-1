# Paper execution specification

## One transition

1. At close `t`, mark current holdings and encode the available observations.
2. Choose buy, sell, or hold without access to `t+1`.
3. Let existing holdings experience the move to close `t+1`.
4. Execute the chosen action at close `t+1`, including adverse slippage and fees.
5. Mark the resulting portfolio at close `t+1`, compute its return since `t`, and update the policy.
6. Continue with `t+1` as the newly observed state.

There is one full bar of execution delay. Prices later than `t+1` are never used in the transition. The final update has no continuation value. The reward includes price movement of existing holdings before execution and costs of the newly selected action. It is a delayed-execution environment, not a claim that the new order earned the preceding price change.

## Default accounting

| Parameter | Value |
| --- | --- |
| Initial cash | $100 in abstract quote units |
| Position | One asset; long-only |
| Buy allocation target | 80% of equity at the execution mark |
| Fee | 0.10% of traded notional |
| Slippage | 0.05%, adverse on both sides |
| Leverage / shorting | None |
| Minimum buy budget | More than 0.01 quote units |

On buy, the available budget is the smaller of cash and the positive gap to the target allocation. The budget includes the fee. On sell, the entire position is liquidated. Hold makes no order. Repeated buys may make small top-up trades; there is no turnover penalty beyond explicit costs.

The allocation target constrains purchases. Price drift can move the held fraction above 80%; the broker does not automatically rebalance or force a sale. Fractional quantities are supported, and there is no exchange lot size or minimum-notional model.

## Outputs

`finalEquity` includes unrealised position value at the last close. No final liquidation fee is charged unless the policy actually sells. `returnPct` is total percentage return from the initial cash. `maxDrawdown` is maximum sampled peak-to-trough equity loss, measured after each transition. It is neither intrabar drawdown nor an annualised risk statistic.

The ledger records executed fills, not rejected or hold decisions. The curve records every simulated transition and its selected action. Buy-and-hold buys at the first permissible next close with the same cost and allocation settings as the other policies.

Exact next-close fills with fixed slippage are an idealisation. Liquidity, bid–ask dynamics, partial fills, latency, outages, corporate actions, funding, taxes, borrow costs and trading sessions are not modelled.
