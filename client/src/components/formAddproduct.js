import { useState } from 'react';

import { Button, Form } from 'react-bootstrap';

import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';

function FormAddProduct({ refetch }) {

    const [form, setForm] = useState({
        name: "",
        price: ""
    });

    const { name, price } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = (e) => {
        alert(1234);
        e.preventDefault();
        addProduct.mutate();
    };

    const addProduct = useMutation(async () => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const body = JSON.stringify({
            name,
            price
        });

        await API.post('/product', body, config);

        refetch();
        setForm({
            name: "",
            price: ""
        })

    });

    return (
        <>
            <Form>
                <Form.Group controlId="formAddProduct" onSubmit={(e) => {
                    e.preventDefault();
                    // handleSubmit(e);
                }}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={name} onChange={(e) => onChange(e)} type="text" placeholder="Enter product name" />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Price</Form.Label>
                    <Form.Control name="price" value={price} onChange={(e) => onChange(e)} type="number" placeholder="Enter product price" />
                </Form.Group>
                <Button variant="primary" className="btn-block btn-sm" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    )
}

export default FormAddProduct;