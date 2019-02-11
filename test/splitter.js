const Splitter = artifacts.require("Splitter");

contract('Splitter', (accounts) => {
  it('should split the received Ether', async () => {
    const splitterInstance = await Splitter.deployed();
    const accountSender = accounts[0];
    const accountOne = accounts[1];
    const accountTwo = accounts[2];
    const amount = 5000000000000000000;

    await splitterInstance.split(accountOne, accountTwo, {from: account[0], value: amount});

    const fundsSender = await splitterInstance.funds.call(accountSender);
    const fundsOne = await splitterInstance.funds.call(accountOne);
    const fundsTwo = await splitterInstance.funds.call(accountTwo);

    const half = amount / 2;

    assert.equal(fundsOne.valueOf(), half, "half wasn't in the first account");
    assert.equal(fundsTwo.valueOf(), half, "half wasn't in the second account");
    assert.equal(fundsSender.valueOf(), amount % 2, "remaining wasn't in the sender's account");
  });
  it('should withdraw the funds', async () => {
    const splitterInstance = await Splitter.deployed();
    const accountOne = accounts[1];
    const accountTwo = accounts[2];
    const amount = 5000000000000000000;

    await splitterInstance.split(accountOne, accountTwo, {from: account[0], value: amount});

    await splitterInstance.withdrawFunds({from: account[1]});
    await splitterInstance.withdrawFunds({from: account[2]});

    const fundsOne = await splitterInstance.funds.call(accountOne);
    const fundsTwo = await splitterInstance.funds.call(accountTwo);

    assert.equal(fundsOne, 0, 'funds one were not correctly withdrawn');
    assert.equal(fundsTwo, 0, 'funds two were not correctly withdrawn');
  });
});
