import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';
import { Badge } from 'react-bootstrap';

import CardProduct from '../components/cardProduct';
// import ModalAddProduct from '../components/modalAddProduct';
import SnapMidtrans from '../components/snapMidtrans';


function CheckStatus({ status }) {
    if (status == "PENDING") {
        return (<Badge variant="warning">{status}</Badge>)
    }

    if (status == "FINISH") {
        return (<Badge variant="success">{status}</Badge>)
    }

    if (status == "DENY") {
        return (<Badge variant="danger">{status}</Badge>)
    }


    // else if (status == "cancel") {
    //     return (<Badge variant="danger">{status}</Badge>)
    // } else if (status == "success") {
    //     return (<Badge variant="success">{status}</Badge>)
    // }

    return status;
}

function Todos() {

    const [snapData, setSnapData] = useState(null);

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        //change this according to your client-key
        const myMidtransClientKey = 'SB-Mid-client-YUogx3u74Gq9MTMS';

        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        }
    }, []);

    // LOAD DATA product
    const { data: products, refetch } = useQuery("productsCache",
        async () => {
            const response = await API.get('/products');
            return response.data.data
        }
    );

    // LOAD DATA transaction
    const { data: transactions, refetch: refetchTransaction } = useQuery("transactionsCache",
        async () => {
            const response = await API.get('/transactions');
            return response.data.data
        }
    );

    console.log(transactions);

    // addProduct

    // Modal
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    // addTransaction
    const prosesAddProduct = useMutation(async (data) => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const body = JSON.stringify(data);

        const dataTransaction = await API.post('/transaction', body, config);

        let dataSetTokenOrder = {
            id: dataTransaction.data.data.id,
            total: dataTransaction.data.data.total
        }

        dataSetTokenOrder = JSON.stringify(dataSetTokenOrder);

        const responseToken = await API.post('/order-product', dataSetTokenOrder, config);
        const token = responseToken.data.data.token;
        console.log(token);

        window.snap.pay(token);

        refetchTransaction();
    });

    const addTransaction = async (id) => {
        const response = await API.get(`/product/${id}`);
        let data = response.data.data;

        data = {
            productId: data.id,
            total: data.price,
            status: "PENDING"
        }

        prosesAddProduct.mutate(data);

        setSnapData(data);
    }

    // Delete All transaction
    const handleDeleteTransaction = useMutation(async () => {
        await API.delete(`/transaction`);
        refetchTransaction();
    });

    return (
        <div className="container">
            <div className="row pt-5">
                <div className="col-12 h3 mb-3 text-center">
                    Our Product
                </div>
                <div className="col-12">
                    {/* <button className="btn btn-sm btn-primary" onClick={handleShow}>
                        Add Product
                    </button>
                    <ModalAddProduct show={show} handleClose={handleClose} /> */}
                </div>
                {products?.map((item, index) => (
                    <>
                        <CardProduct item={item} index={index} refetch={refetch} addTransaction={addTransaction} />
                    </>
                ))}
            </div>
            <div className="row pt-5">
                <div className="col-12 h3 mb-3 text-center">
                    Transaction
                    <button className="btn btn-sm btn-danger py-0 ml-2" onClick={() => handleDeleteTransaction.mutate()}>clear</button>
                </div>
                <div className="col-12">
                    {transactions?.length != 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Id Transaction</th>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.product.name}</td>
                                            <td>{item.total}</td>
                                            <td><CheckStatus status={item.status} /></td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-secondary text-center h3">
                            <i>
                                No data transaction
                            </i>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default Todos;