import Image from 'next/image';
import Link from 'next/link';
import { getProductsInsecure } from '../../database/products';
import { getCookie } from '../../util/cookies';
import { parseJson } from '../../util/json';
import ButtonCheckout from './buttonCheckout';
import CartForm from './cartForm';
import styles from './page.module.scss';

export const metadata = {
  title: 'Cart',
  description: 'Cart',
};
export default async function CartPage() {
  const products = await getProductsInsecure();
  const productQuantitiesCookie = await getCookie('cart');
  let orderPrice = 0;
  let totalProducts = 0;
  let productQuantities = parseJson(productQuantitiesCookie) || [];

  if (!Array.isArray(productQuantities)) {
    productQuantities = [];
  }

  if (!productQuantitiesCookie || productQuantities.length === 0) {
    return (
      <div>
        <h1> Cart </h1>

        <p className={styles.cartContent}>Your cart is empty</p>
      </div>
    );
  }
  /* const cartProducts = products.map((product) => {
    const productInCart = productQuantities.find(
      (productObject) => productObject.id === product.id,
    );
    return {
      ...product,
      productAmount: productInCart.quantity,
    };
  });

  console.log('cartProducts:' + parseJson(cartProducts));*/
  return (
    <div>
      <h1> Cart </h1>
      <p>Cart cookie: {productQuantitiesCookie}</p>
      <div className={styles.cartContent}>
        {products.map((product) => {
          const productQuantity = productQuantities.find(
            (productObject) => product.id === productObject.id,
          );
          const productTotalPrice = productQuantity
            ? product.price * parseInt(productQuantity.quantity)
            : 0;
          if (productTotalPrice > 0) {
            orderPrice += productTotalPrice;
            totalProducts += parseInt(productQuantity.quantity);
            return (
              <div
                key={`product-${product.id}`}
                className={styles.productWrap}
                data-test-id={`cart-product-${product.id}`}
              >
                <Link
                  href={`/products/${product.id}`}
                  data-test-id={`product-${product.id}`}
                >
                  <Image
                    src={`/images/${product.image}`}
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                </Link>
                <div className={styles.productOrder}>
                  <h3>{product.name}</h3>
                  <div>
                    Amount:{' '}
                    <span data-test-id={`cart-product-quantity-${product.id}`}>
                      {productQuantity?.quantity}
                    </span>
                  </div>
                </div>
                <h3>€ {productTotalPrice}</h3>
                <CartForm productId={product.id} />
              </div>
            );
          }
        })}
      </div>
      <div>
        <div>
          Total ({totalProducts}):{' '}
          <strong>
            € <span data-test-id="cart-total">{orderPrice}</span>
          </strong>
        </div>
        <Link href="/checkout">
          <ButtonCheckout />
        </Link>
      </div>
    </div>
  );
}
