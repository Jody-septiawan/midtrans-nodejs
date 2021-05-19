import Rupiah from './convertRupiah';

function cardProduct({ item, index, addTransaction }) {
    return (
        <div className="col-lg-3 col-md-4" key={index + 1}>
            <div className="card shadow product">
                <div className="card-body p-2">
                    <img src="./assets/default.jpg" className="img-fluid rounded" />
                    <div className="name">
                        {item.name}
                    </div>
                    <div className="price">
                        Rp. <Rupiah nominal={item.price} />
                    </div>
                    <button onClick={() => addTransaction(item.id)} className="btn btn-sm btn-info btn-block py-0 mt-3">Buy</button>
                </div>
            </div>
        </div>
    )
}

export default cardProduct;