const { product } = require('../../models');
const midtransClient = require('midtrans-client');


exports.getProducts = async (req, res) => {
    try {

        const data = await product.findAll({
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

exports.getProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await product.findOne({
            where: {
                id
            },
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

exports.addProduct = async (req, res) => {
    try {

        const dataAddProduct = req.body;

        await product.create(dataAddProduct);

        const data = await product.findAll({
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


exports.orderProduct = async (req, res) => {
    try {

        const data = req.body;

        // return res.send({
        //     data
        // })

        // Create Snap API instance
        let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: 'SB-Mid-server-fJAy6udMPnJCIyFguce8Eot3'
        });

        let parameter = {
            "transaction_details": {
                "order_id": data.id,
                "gross_amount": data.total
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": {
                "first_name": "jody",
                "last_name": "septiawan",
                "email": "jody.septiawan@gmail.com",
                "phone": "08111222333"
            }
        };

        snap.createTransaction(parameter)
            .then((transaction) => {
                // transaction token
                let transactionToken = transaction.token;
                res.send({
                    status: "success",
                    data: { token: transactionToken }
                })
            })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}