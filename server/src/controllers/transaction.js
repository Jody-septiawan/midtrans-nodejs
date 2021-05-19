const { product, transaction } = require('../../models');
const midtransClient = require('midtrans-client');


exports.getTransactions = async (req, res) => {
    try {

        const data = await transaction.findAll({
            order: [
                ['id', 'ASC'],
            ],
            include: [
                {
                    model: product,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        res.send({
            status: "success",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.addTransaction = async (req, res) => {
    try {

        let dataAddProduct = req.body;

        dataAddProduct = {
            id: "TR" + dataAddProduct.productId + Date.now(),
            ...dataAddProduct
        }

        // return res.send(dataAddProduct);

        const data = await transaction.create(dataAddProduct);

        const dataNew = await transaction.findOne({
            where: {
                id: data.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        res.send({
            status: "success",
            data: dataNew
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.deleteTransactions = async (req, res) => {
    try {
        await transaction.destroy({
            where: {},
            truncate: true
        })

        res.send({
            status: "success",
            message: "delete all transaction success"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        await transaction.update(data, {
            where: {
                id
            }
        })

        res.send({
            status: "success",
            message: "update transaction success"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

const MIDTRANS_CLIENT_KEY = "SB-Mid-client-YUogx3u74Gq9MTMS";
const MIDTRANS_SERVER_KEY = "SB-Mid-server-fJAy6udMPnJCIyFguce8Eot3";

const core = new midtransClient.CoreApi();

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
});

const handleTransaction = async (status, transactionId) => {
    await transaction.update({
        status
    },
        {
            where: {
                id: transactionId
            }
        }
    )
}

exports.notification = async (req, res) => {
    try {
        const data = req.body;

        const statusResponse = await core.transaction.notification(data);

        console.log("statusResponse", statusResponse);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                handleTransaction("PENDING", orderId);
            } else if (fraudStatus == "accept") {
                handleTransaction("FINISH", orderId);
            }
        } else if (transactionStatus == "settlement") {
            handleTransaction("FINISH", orderId);
        } else if (transactionStatus == "deny") {
            handleTransaction("DENY", orderId);
        } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
            handleTransaction("EXPIRECANCEL", orderId);
        } else if (transactionStatus == "pending") {
            handleTransaction("PENDING", orderId);
        }

        res.status(200).send(
            { status: "success" }
        )

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}
