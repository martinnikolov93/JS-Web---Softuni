module.exports = {
    isEqual: function (a, b) {
        return a == b
    },
    passError: (errorMessage) => {
        return {
            error: true,
            message: errorMessage
        }
    }
}