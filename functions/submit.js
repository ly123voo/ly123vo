exports.handler = async (event, context) => {
    const { name, message } = JSON.parse(event.body);

    return {
        statusCode: 200,
        body: JSON.stringify({ name, message }),
    };
};