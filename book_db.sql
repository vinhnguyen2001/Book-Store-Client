--drop database if exists book_db;
--create database book_db;


-- Thể loại sách. Cố định, chỉ có thể thêm trực tiếp từ db, không làm thao tác xóa thể loại.
drop table if exists categories cascade;
create table categories (
	category_id		serial,
	category_name		varchar(30),
	
	primary key(category_id)
);

-- Tên tác giả. Chỉ có thể thêm, sửa tên
drop table if exists authors cascade;
create table authors (
	author_id			serial,
	author_name			varchar(255),
	
	primary key(author_id)
);

-- Nhà xuất bản. Chỉ có thể thêm, sửa tên
drop table if exists publishers cascade;
create table publishers (
	publisher_id			serial,
	publisher_name		varchar(255),
	
	primary key(publisher_id)
);


-- Sách. Staff có thể thêm, xóa, sửa. account chỉ có thể xem
drop table if exists products cascade;
create table products (
	product_id	serial,
	product_name	varchar(255),
	description		varchar(255),
	category_id		serial,
	author_id		serial,
	publisher_id		serial,
	price		numeric(19, 4),
	stock		int, --Số lượng trong kho
	is_active	int,
	
	primary key(product_id),
	
	constraint fk_product_category --Chỉ được thêm sách từ thể loại cho trước
	foreign key(category_id) references categories,
	
	constraint fk_product_author --Chỉ được thêm sách từ tác giả cho trước
	foreign key(author_id) references authors,
	
	constraint fk_product_publisher --Chỉ được thêm sách từ nhà xuất bản cho trước
	foreign key(publisher_id) references publishers
);

-- Hình ảnh
drop table if exists images cascade;
create table images (
	image_id	serial,
	product_id	serial,
	image_link varchar(500),
	primary key(image_id),
	
	constraint fk_image_product
	foreign key (product_id) references products
);

-- Tài khoản. Chỉ có thể thêm vào, không làm thao tác xóa tài khoản
drop table if exists accounts cascade;
create table accounts (
	account_id		serial,
	username	varchar(50), --Tên đăng nhập
	pwd			varchar(255),
	firstname	varchar(50), --Họ, tên đệm
	lastname	varchar(50), --Tên
	phone		varchar(15), --Sđt, phục vụ cho việc liên lạc
	address		varchar(15), --Sđt, phục vụ cho việc liên lạc
	ward		varchar(15), --Sđt, phục vụ cho việc liên lạc
	district		varchar(15), --Sđt, phục vụ cho việc liên lạc
	province		varchar(15), --Sđt, phục vụ cho việc liên lạc

	-- Khi đăng ký chỉ tạo tài khoản customer thêm vào db
	-- Tài khoản onwer chỉ có thể thêm trực tiếp từ db
	role_id		int, --0: customer; 1: staff; 2: admin;
	account_status	int,

	primary key(account_id)
);

-- Bình luận
-- Owner có thể xem, xóa tất cả bình luận
-- Customer chỉ có thể xem bình luận tương ứng từng giày
drop table if exists comments cascade;
create table comments (
	comment_id		serial,
	product_id		serial, --Trang giày được bình luận
	account_id		serial, 
	comment_time	timestamp, --Thời điểm bình luận
	comment_body	varchar(255), --Nội dung comment, giới hạn 255 ký tự
	primary key(comment_id),

	constraint fk_comment_account
	foreign key(account_id) references accounts,
	
	constraint fk_comment_product  --Lưu ý xóa comment thuộc giày trước khi owner xóa giày
	foreign key(product_id) references products
);

-- Giỏ hàng. Mỗi customer có 1 giỏ hàng riêng.
-- Khi customer đăng ký sẽ tự động tạo 1 giỏ hàng mới của customer đó đưa vào db.
-- Vì vậy, giỏ hàng có tính chất như customer.
drop table if exists carts cascade;
create table carts (
	cart_id		serial,
	account_id		serial,
	
	primary key(cart_id),
	
	constraint fk_cart_account
	foreign key(account_id) references accounts
);

-- Thông tin giỏ hàng, gồm nhiều sách trong giỏ
drop table if exists cart_content cascade;
create table cart_content (
	cart_content_id	serial,
	cart_id			serial,
	product_id		serial,
	cart_quantity		int,

	primary key(cart_content_id),
	
	constraint fk_cc_cart
	foreign key(cart_id) references carts,

	constraint fk_cc_product
	foreign key(product_id) references products
);

-- Đơn hàng.
-- Owner có thể xem, sửa state, hủy (khó, khỏi làm cũng được) mọi hóa đơn. Customer chỉ có thể xem đơn hàng của mình.
-- Không làm thao tác xóa đơn hàng
drop table if exists orders cascade;
create table orders (
	order_id		serial,
	account_id			serial, --Chủ hóa đơn
	oder_total			numeric(19, 4),
	order_time		timestamp, --Ngày giờ tạo hóa đơn
	order_phone		varchar(15), --Sđt, phục vụ cho việc giao hàng
	order_a		varchar(15), --Sđt, phục vụ cho việc liên lạc
	order_w		varchar(15), --Sđt, phục vụ cho việc liên lạc
	order_d		varchar(15), --Sđt, phục vụ cho việc liên lạc
	order_p		varchar(15), --Sđt, phục vụ cho việc liên lạc
	-- Sẽ có 2 lựa chọn là "Đặt mua" \(thanh toán sau khi nhận hàng\) -> tạo hóa đơn state 0
    --				  hoặc "Thanh toán ngay" 						  -> tạo hóa đơn state 1
	-- Owner sẽ quản lý hóa đơn bằng cách sửa state hóa đơn giữa 0 và 1
	--hoặc hủy hóa đơn \(khó hơn, chắc khỏi làm, vì có liên quan đến vụ thêm lại
	--quantity của từng giày vào lại db, bao gồm xác thực giày còn trong db không\) 

	order_status		int, --- -1: đã hủy --0: chưa xác nhận; 1: đã xác nhận; 2: đang giao; 3: đã giao
	
	primary key(order_id),
	
	constraint fk_order_account
	foreign key(account_id) references accounts
);

-- Thông tin hóa đơn, gồm nhiều sản phẩm trong hóa đơn
drop table if exists order_content cascade;
create table order_content (
	order_content_id	serial,
	order_id			serial,
	product_id	serial,
	order_price		numeric(19, 4),
	order_quantity	int,

	primary key(order_content_id),
	
	constraint fk_oc_order
	foreign key(order_id) references orders,

	constraint fk_oc_product
	foreign key(product_id) references products
);


-- Dữ liệu mẫu tạm
insert into categories(category_name) values
('Truyện tranh'), ('Truyện ngắn - Tản văn'), ('Sách giáo khoa'), ('Kinh tế'), ('Tâm lý - Kỹ năng sống');

insert into authors(author_name) values
('Nhiều tác giả'), ('Tác giả truyện tranh 1'), ('Tác giả truyện ngắn 1'), ('Tác giả kinh tế 1'), ('Tác giả tâm lý 1');

insert into publishers(publisher_name) values
('Nhà xuất bản Giáo dục'), ('Nhà xuất bản Kim Đồng'), ('Nhà xuất bản Trẻ'), ('Nhà xuất bản tổng hợp HCM');

insert into products(product_name, description, category_id, author_id, publisher_id, price, stock, is_active) values
('Truyện tranh 1', 'Mô tả truyện tranh 1', 1, 2, 2, 20000, 99, 1), ('Truyện tranh 2', 'Mô tả truyện tranh 2', 1, 2, 2, 40000, 199, 1),
('Truyện ngắn 1', 'Mô tả truyện ngắn 1', 2, 3, 3, 60000, 199, 1), ('Truyện ngắn 2', 'Mô tả truyện ngắn 2', 2, 3, 3, 80000, 99, 1),
('Sách kinh tế 1', 'Có làm thì mới có ăn. Không làm mà đòi ăn thì ăn đồng bằng, ăn cỏ.', 4, 4, 4, 50000, 99, 1), ('Sách kinh tế 2', 'Ngã ở đâu gấp đôi ở đó', 4, 4, 4, 120000, 199, 1),
('Sách giáo khoa 1', 'Mô tả giáo khoa 1', 3, 1, 1, 10000, 199, 1), ('Sách giáo khoa 2', 'Mô tả giáo khoa 2', 3, 1, 1, 20000, 99, 1),
('Sách tâm lý 1', 'Mô tả tâm lý 1', 5, 5, 4, 90000, 99, 1), ('Sách tâm lý 2', 'Mô tả tâm lý 2', 5, 5, 4, 80000, 199, 1);

insert into images(product_id, image_link) values
(1, 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan-hoat-hinh-mau---ke-hanh-phap-zero-tap-2.jpg'),
(2, 'https://cdn0.fahasa.com/media/catalog/product/b/a/bai-tho-tinh-tham-do-2.jpg'),
(3, 'https://cdn0.fahasa.com/media/catalog/product/c/o/combo0808195.jpg'),
(4, 'https://cdn0.fahasa.com/media/catalog/product/6/0/600boxset-vang-am-ap---kho-sach-10x14.5cm.jpg'),
(5, 'https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_09462021_024609.jpg'),
(6, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_10704.jpg'),
(7, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_233238.jpg'),
(8, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_233261.jpg'),
(9, 'https://cdn0.fahasa.com/media/catalog/product/p/h/ph_c-h_a-ch_n-dung-k_-ph_m-t_i.jpg'),
(10, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_208345.jpg');