function statusOperation(statusOperationCode, description, errors, data){
    return{
        statusOperation: {
            code: statusOperationCode,
            description: description,
            errors: errors
        },
        data
    }
}

exports.statusOperation = statusOperation