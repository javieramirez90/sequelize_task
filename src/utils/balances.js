const handleBalanceOperations = (initialBalance, qty, operation) =>  {
  if(operation === 'pay') {
    return initialBalance - qty;
  }
  if(operation === 'toBePayed') {
    return initialBalance + qty;
  }
  return initialBalance;
};

module.exports = {
  handleBalanceOperations
};
