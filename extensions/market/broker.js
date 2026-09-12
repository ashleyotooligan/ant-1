/** Long-only paper execution. No authentication, wallet or exchange-order route. */
export class PaperBroker {
  constructor({cash=100,fee=0.001,slippage=0.0005,maxAllocation=0.8}={}){
    if(!Number.isFinite(cash)||cash<=0||![fee,slippage,maxAllocation].every(Number.isFinite)||fee<0||fee>=1||slippage<0||slippage>=1||maxAllocation<=0||maxAllocation>1)throw new Error('Invalid broker configuration.');
    this.initialCash=cash;this.cash=cash;this.quantity=0;this.fee=fee;this.slippage=slippage;this.maxAllocation=maxAllocation;this.ledger=[];this.peak=cash;this.lastReward=0;
  }
  equity(price){return this.cash+this.quantity*price;}
  drawdown(price){return 1-this.equity(price)/Math.max(this.peak,this.equity(price));}
  execute(action,price,timestamp){
    if(!Number.isFinite(price)||price<=0)throw new Error('Execution price must be finite and positive.');
    if(!['buy','sell','hold'].includes(action))throw new Error('Unknown paper action.');
    const before=this.equity(price);
    if(action==='buy'){
      const room=Math.max(0,this.maxAllocation*before-this.quantity*price);
      const budget=Math.min(this.cash,room);
      if(budget>0.01){const fill=price*(1+this.slippage),cost=budget/(1+this.fee),quantity=cost/fill;
        this.cash-=budget;this.quantity+=quantity;this.ledger.push({timestamp,side:'buy',quantity,price:fill,fee:budget-cost,cash:this.cash});}
    }
    if(action==='sell'&&this.quantity>1e-10){const fill=price*(1-this.slippage),gross=this.quantity*fill,fee=gross*this.fee;
      this.cash+=gross-fee;this.ledger.push({timestamp,side:'sell',quantity:this.quantity,price:fill,fee,cash:this.cash});this.quantity=0;}
    this.peak=Math.max(this.peak,this.equity(price));
    return this.equity(price)-before;
  }
}
