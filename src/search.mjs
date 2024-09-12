
// Find documents where namn starts with string
const criteria2 = {
    namn: /^Sn/
};
const projection2 = {
    _id: 1,
    namn: 1
};
const limit2 = 3;

// Do it within an Immediately Invoked Async Arrow Function.
// This is to enable usage of await within the function scope.
(async () => {
    // Find using await
    try {
        let res = await findInCollection(
            dsn, "crowd", criteria2, projection2, limit2
        );
        console.log(res);
    } catch(err) {
        console.log(err);
    }
})();

// Another way with than
(() => {
    // Find using .then()
    findInCollection(dsn, "crowd", criteria1, projection1, limit1)
    .then(res => console.log(res))
    .catch(err => console.log(err));
})();