var account = {
    balance: 0,
    deposit: function deposit(amount, callback) {
        this.balance += amount;
        callback(this.balance);
    }
};

account.deposit(42, function(balance) {
    console.log("Balance:", balance);
});
