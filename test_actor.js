/*

 Actor Model in Javascript
 From code found on: http://www.dalnefre.com/wp/2014/03/actors-in-javascript/

Our first step toward actors is generalizing an asynchronous execution primitive. Essentially what we want is setTimeout() with no delay. Node.js calls this setImmediate(), but supports some additional functionality we don’t need, so we will introduce a streamlined version called invokeLater().
*/

if (typeof setImmediate === 'function') {
    var invokeLater = function (callback) { 
        setImmediate(callback); 
    };
} else if (typeof setTimeout === 'function') {
    var invokeLater = function (callback) { 
        setTimeout(callback, 0); 
    };
}


/*
Discussions with Carl Hewitt about mapping actor semantics to JavaScript led to a focus on the “send” primitive. An actor send is different than a callback invocation because the send only schedules the message for later delivery. Building on invokeLater() here is a simple implementation of send:

The send() function returns immediately, but schedules the later execution of a function that invokes the behavior of a recipient actor, to deliver the message. Any returnValue produced by the behavior is passed as a parameter to the (synchronous) callback function.
*/

var send = function send(recipient, message, callback) {
    invokeLater(function () {
        var returnValue = recipient.behavior(message);
        callback(returnValue);
    });
};


/*
Using this implementation, an actor is simply any object with a behavior method, as shown below. Note that inside the behavior, the keyword this refers to the recipient actor/object. We can use a factory function to construct new actor instances that follow this protocol.

Each call to this factory creates an “Account” instance with an initial balance of zero. The behavior function is defined to look for deposit messages containing an amount to add to the balance. The resulting balance is returned, where it becomes the parameter to the callback function.

*/

var createAccount = function createAccount() {
    return {
        balance: 0,
        behavior: function (message) {
            if (message.type === 'deposit') {
                this.balance += message.amount;
                return this.balance;
            }
        }
    };
};


/*
A new account is created and sent a deposit message. After the deposit is processed, the new balance is displayed on the console.
*/

var account = createAccount();

send(account, { type: 'deposit', amount: 42 }, function (returnValue) {
    console.log('New balance is', returnValue);
});
