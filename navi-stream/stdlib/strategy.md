---
order: 5
---

# strategy

## entry

`entry(id: string, side: direction, quantity: number, price: number = nil, remark: string = nil)`

Creates a new order to open or add to a position.

If the call does not contain `price` argument, it creates a market order, otherwise, it creates a limit order.

Orders from this command, unlike those from `strategy.order`, are affected by the `pyramiding` parameter. Pyramiding specifies the number of concurrent open entries allowed per position. For example, with `pyramiding = 3`, the strategy can have up to three open trades, and the command cannot create orders to open additional trades until at least one existing trade closes.

When a strategy executes an order from this command in the opposite direction of the current market position, it reverses that position. For example, if there is an open long position of five shares, an order from this command with a `quantity` of 5 and a direction of `direction.short` triggers the sale of 10 shares to close the long position and open a new five-share short position.

## order

`order(id: string, side: direction, quantity: number, price: number = nil, remark: string = nil)`

Creates a new order to open, add to, or exit from a position.

If the call does not contain `price` argument, it creates a market order, otherwise, it creates a limit order.

Orders from this command, unlike those from `strategy.entry`, are not affected by the `pyramiding` parameter. Strategies can open any number of trades in the same direction with calls to this function.

This command does not automatically reverse open positions because it does not exclusively create entry orders like `strategy.entry` does. For example, if there is an open long position of five shares, an order from this command with a `quantity` of 5 and a direction of `direction.short` triggers the sale of five shares, which closes the position.

## close

`close(id: string, quantity: number = nil, remark: string = nil)`

Creates an order to exit from the part of a position opened by entry orders with a specific identifier. If multiple entries in the position share the same ID, the orders from this command apply to all those entries, starting from the first open trade, when its calls use that ID as the id argument.

This command always generates market orders.

## cancel

`cancel(id: string)`

Cancels a pending or unfilled order with a specific identifier. If multiple unfilled orders share the same ID, calling this command with that ID as the id argument cancels all of them. If a script calls this command with an id representing the ID of a filled order, it has no effect.

## cancel_all

`cancel_all()`

Cancels all pending or unfilled orders, regardless of their identifiers.

This command is most useful when working with price-based orders (e.g., limit orders).


## initial_cash

`initial_cash(): number`

Returns the amount of initial capital set in the strategy properties.

## position_size

`position_size(): number`

Returns the direction and size of the current market position. If the value is > 0, the market position is long. If the value is < 0, the market position is short.

## avg_trade

`avg_trade(): number`

Returns the average amount of money gained or lost per trade. Calculated as the sum of all profits and losses divided by the number of closed trades.

## avg_trade_percent

`avg_trade_percent(): number`

Returns the average percentage gain or loss per trade. Calculated as the sum of all profit and loss percentages divided by the number of closed trades.

## net_profit

`net_profit(): number`

Returns the total currency value of all completed trades.

## net_profit_percent

`net_profit_percent(): number`

Returns the total value of all completed trades, expressed as a percentage of the initial capital.

## gross_profit

`gross_profit(): number`

Returns the total currency value of all completed winning trades.

## gross_profit_percent

`gross_profit_percent(): number`

Returns the total currency value of all completed winning trades, expressed as a percentage of the initial capital.

## gross_loss

`gross_loss(): number`

Returns the total currency value of all completed losing trades.

## gross_loss_percent

`gross_loss_percent(): number`

Returns the total currency value of all completed losing trades, expressed as a percentage of the initial capital.

## open_profit

`open_profit(): number`

Returns the total currency value of all open trades.

## max_runup

`max_runup(): number`

Returns the maximum equity run-up value for the whole trading interval.

## max_runup_percent

`max_runup_percent(): number`

Returns the maximum equity run-up value for the whole trading interval, expressed as a percentage and calculated by formula: `Highest Value During Trade / (Entry Price x Quantity)`.

## max_drawdown

`max_drawdown(): number`

Returns the maximum equity drawdown value for the whole trading interval.

## max_drawdown_percent

`max_drawdown_percent(): number`

Returns the maximum equity drawdown value for the whole trading interval, expressed as a percentage and calculated by formula: `Lowest Value During Trade / (Entry Price x Quantity)`.

## max_held_all

`max_held_all(): number`

Returns the maximum number of contracts/shares/lots/units in one trade for the whole trading interval.

## max_held_long

`max_held_long(): number`

Returns the maximum number of contracts/shares/lots/units in one long trade for the whole trading interval.

## max_held_short

`max_held_short(): number`

Returns the maximum number of contracts/shares/lots/units in one short trade for the whole trading interval.

## position_avg_price

`position_avg_price(): number`

Returns the average entry price of current market position. If the market position is flat, `nil` is returned.

## win_trades

`win_trades(): number`

Returns number of profitable trades for the whole trading interval.

## loss_trades

`loss_trades(): number`

Returns number of losing trades for the whole trading interval.

## open_trades

`open_trades(): [opentrade]`

Returns an array of open trades.

## closed_trades

`closed_trades(): [closedtrade]`

Returns an array of closed trades.