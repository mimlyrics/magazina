import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { PRODUCT_URL } from '../../routes/serverRoutes';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import { selectCurrentToken } from '../../slices/auth/authSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import BASE_URL from '../../routes/serverRoutes';

const Products = () => {
    const [errMsg, setErrMsg] = useState();
    const [products, setProducts] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [category, setCategory] = useState("");
    const token = useSelector(selectCurrentToken);
    const { cart, dispatch } = useStateContext();

    useEffect(() => {
        const { categoryx } = queryString.parse(location.search);
        setCategory(categoryx);
    }, [location.search]);

    useEffect(() => {
        const getProductByCategory = async () => {
            try {
                const res = await axios.get(PRODUCT_URL, {
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    withCredentials: true
                });
                setProducts(res.data);
            } catch (err) {
                setErrMsg(err?.response?.data);
            }
        };

        getProductByCategory();
    }, [category, token]);

    useEffect(() => {
        if (products && category) {
            setProductsByCategory(products.filter(product => product.productCategory?.id === parseInt(category)));
        }
    }, [products, category]);

    // Function to check if the product is already in the cart
    const isProductInCart = (productId) => {
        return cart.items.some(item => item.productId === productId);
    };

    const handleAddToCart = (product) => {
        if (!isProductInCart(product.id)) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                },
            });
        }
    };

    console.log(cart);

    return (
        <div className='md:ml-[32%] xl:ml-[23%] mt-1 mb-4'>
            <div className='mx-2 my-2 text-teal-800 text-lg md:text-2xl'>
                <input
                    type="text"
                    placeholder='search..'
                    className='border rounded-lg w-[75%] p-3 md:p-5 outline-2 outline-indigo-300'
                />
                <button className='shadow-indigo-500 p-3 md:p-5 text-white border bg-indigo-700 w-[20%] shadow-md rounded-lg px-7'>
                    Search
                </button>
            </div>

            <div className='grid bg-slate-400 grid-cols-2 md:grid-cols-3 w-full gap-4 p-5'>
                {Array.isArray(productsByCategory) && productsByCategory.length > 0 ? (
                    productsByCategory.map(product => (
                        <div key={product.id} className='bg-slate-100 rounded-md p-4'>
                            <h1>Price: {product.price}</h1>
                            <h3>{product.name}</h3>
                            {product.images && product.images.map(image => (
                                <div key={image.id}>
                                    <img src={`${BASE_URL}/${image.imageUrl}`} alt="Product" />
                                </div>
                            ))}
                            <p>{product.description}</p>

                            {/* Check if product is already in the cart */}
                            <button
                                onClick={() => handleAddToCart(product)}
                                className={`p-3 rounded-md ${isProductInCart(product.id) ? 'bg-indigo-100' : 'bg-indigo-400 hover:bg-indigo-800'} text-white`}
                                disabled={isProductInCart(product.id)}
                            >
                                {isProductInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
