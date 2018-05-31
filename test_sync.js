var account = {
    balance: 0,
    deposit: function deposit(amount) {
        this.balance += amount;
        return this.balance;
    }
};

var balance = account.deposit(42);
console.log("Balance:", balance);
