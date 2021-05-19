import { Modal } from 'react-bootstrap';

import FormAddProduct from './formAddproduct';

function modalAddProduct({ handleClose, show, refetch }) {

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="py-3">
                    <Modal.Title className="h6">Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormAddProduct refetch={refetch} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default modalAddProduct;