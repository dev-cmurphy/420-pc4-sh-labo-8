DROP TABLE IF EXISTS cart_product;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS purchase_order;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS product;


CREATE TABLE product (
	product_id text PRIMARY KEY,
	name text NOT NULL,
	price numeric(10,2) NOT NULL,
	description text NOT NULL,
	image_content bytea,
	image_content_type text,
	long_desc text,
	is_active boolean NOT NULL DEFAULT true
);


CREATE TABLE user_account (
	user_account_id text PRIMARY KEY,
	password_hash text,
	password_salt text,
	user_full_name text,
	is_active boolean NOT NULL DEFAULT true,
	is_admin boolean NOT NULL DEFAULT false
);


CREATE TABLE purchase_order (
	purchase_order_key serial PRIMARY KEY,
	user_account_id text NOT NULL REFERENCES user_account (user_account_id) ON DELETE NO ACTION,
	payment_name text NOT NULL,
	payment_credit_card_number text NOT NULL,
	payment_credit_card_exp text NOT NULL,
	exp_method text NOT NULL CHECK (exp_method IN ('postescanada', 'fedex', 'purolator')),
	address_name text NOT NULL,
	address text NOT NULL,
	address_city text NOT NULL,
	address_province text NOT NULL,
	address_postal_code text NOT NULL,
	order_date_time timestamp with time zone NOT NULL
);

CREATE INDEX idx_purchase_order_user_account_id ON purchase_order (user_account_id);
CREATE INDEX idx_purchase_order_order_date_time ON purchase_order (order_date_time);


CREATE TABLE cart (
	cart_key serial PRIMARY KEY,
	user_account_id text NOT NULL REFERENCES user_account (user_account_id) ON DELETE NO ACTION,
	purchase_order_key integer REFERENCES purchase_order (purchase_order_key) ON DELETE NO ACTION
);

CREATE INDEX idx_cart_user_account_id ON cart (user_account_id);
CREATE INDEX idx_cart_purchase_order_key ON cart (purchase_order_key);


CREATE TABLE cart_product (
	cart_key integer NOT NULL REFERENCES cart (cart_key) ON DELETE CASCADE,
	product_id text NOT NULL REFERENCES product (product_id) ON DELETE NO ACTION,
	quantity integer NOT NULL,
	sale_price numeric(10,2)
);

CREATE INDEX idx_cart_product_cart_key ON cart_product (cart_key);
CREATE INDEX idx_cart_product_product_id ON cart_product (product_id);
