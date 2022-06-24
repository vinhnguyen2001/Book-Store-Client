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
	description		varchar(1000),
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
	image_id	int,
	product_id	serial,
	image_link varchar(1000),
	primary key(image_id, product_id),
	
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
	address		varchar(255), --Sđt, phục vụ cho việc liên lạc
	ward		varchar(50), --Sđt, phục vụ cho việc liên lạc
	district		varchar(50), --Sđt, phục vụ cho việc liên lạc
	province		varchar(50), --Sđt, phục vụ cho việc liên lạc

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
	comment_status	int,

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
	order_total			numeric(19, 4),
	order_time		timestamp, --Ngày giờ tạo hóa đơn
	order_phone		varchar(15), --Sđt, phục vụ cho việc giao hàng
	order_a		varchar(255), --Sđt, phục vụ cho việc liên lạc
	order_w		varchar(50), --Sđt, phục vụ cho việc liên lạc
	order_d		varchar(50), --Sđt, phục vụ cho việc liên lạc
	order_p		varchar(50), --Sđt, phục vụ cho việc liên lạc
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
('Truyện tranh'), ('Truyện ngắn - Tản văn'), ('Sách giáo khoa'), ('Ngôn tình'),
('Bài học kinh doanh'), ('Quản trị - lãnh đạo'), ('Martketing - Bán hàng'), ('Phân tích kinh tế'),
('Kỹ năng sống'), ('Rèn luyện nhân cách'), ('Tâm lí'), ('Sách cho tuổi mới lớn');

insert into authors(author_name) values
('Gosho Aoyama'), ('Yoshito Usui'), ('Fujiko F Fujio'), ('Eiichiro Oda'), ('Masashi Kishimoto'), ('Akira Toriyama'), ('Gege Akutami') ,('Tatsuya Endo'), ('Kohei Horikoshi'), ('Riichiro Inagaki'),
('Nguyễn Nhật Ánh'), ('Nam Cao'), ('Nguyễn Ngọc Tư'), ('Writinman'), ('Nguyễn Hưng'),
('Bộ Giáo Dục Và Đào Tạo');

insert into publishers(publisher_name) values
('NXB Giáo dục Việt Nam'), ('NXB Kim Đồng'), ('NXB Trẻ'), ('NXB Văn học'), ('NXB Dân Trí'), ('NXB tổng hợp HCM');

insert into products(product_name, description, category_id, author_id, publisher_id, price, stock, is_active) values
('Thám Tử Lừng Danh Conan - Tập 96', 'Thuộc bộ tuyện Thám Tử Lừng Danh Conan ', 1, 1, 2, 20000, 200, 1),
('Shin - Cậu Bé Bút Chì - Đặc Biệt Tập 7', 'Thuộc bộ truyện Shin - Cậu Bé Bút Chì', 1, 2, 2, 19000, 200, 1),
('Fujiko F Fujio Đại Tuyển Tập - Doraemon Truyện Ngắn - Tập 15', 'Thuộc bộ truyện Doraemon', 1, 3, 2, 136000, 200, 1),
('One Piece - Tập 90: Thánh Địa Mary Geoise', 'Thuộc bộ truyện One Piece', 1, 4, 2, 25000, 200, 1),
('Naruto - Tập 61: Huynh Đệ Song Thủ!!', 'Thuộc bộ truyện Naruto', 1, 5, 2, 25000, 200, 1),
('Dragon Ball Full Color - Phần Năm: Truy Lùng Cell Bọ Hung - Tập 1', 'Thuộc bộ truyện Gragon Ball', 1, 6, 2, 77000, 200, 1),
('Chú Thuật Hồi Chiến - Tập 4', 'Thuộc bộ truyện Chú Thuật Hồi Chiến', 1, 7, 2, 30000, 200, 1),
('Spy X Family - Tập 7', 'Thuộc bộ truyện Spy X Family', 1, 8, 2, 25000, 200, 1),
('My Hero Academia - Học Viện Siêu Anh Hùng - Tập 29: Bakugo Katsuki: Trỗi Dậy', 'Thuộc bộ truyện My Hero Academia', 1, 9, 2, 25000, 200, 1),
('Dr.STONE - Tập 19: Thành Phố Ngô 1 Triệu Dân', 'Thuộc bộ truyện Dr.STONE', 1, 10, 2, 25000, 200, 1),
('Út Quyên Và Tôi', 'Tập truyện ngắn với 12 câu chuyện là 12 niềm vui, 12 kỉ niệm dễ thương, 12 bài học giản dị mà sâu sắc… Gặp trong tập truyện này những hình ảnh rất dễ thương, những lời thoại rất học trò…', 2, 11, 3, 45000, 200, 1),
('Chí Phèo', 'Chí Phèo là một truyện ngắn nổi tiếng của nhà văn Nam Cao viết vào tháng 2 năm 1941. Chí Phèo là một tác phẩm xuất sắc, thể hiện nghệ thuật viết truyện độc đáo của Nam Cao, đồng thời là một tấn bi kịch của một người nông dân nghèo bị tha hóa trong xã hội. Hiện nay, truyện đã được đưa vào sách giáo khoa Ngữ Văn 11, tập 1. Chí Phèo cũng là tên nhân vật chính của truyện.', 2, 12, 4, 45000, 200, 1),
('Không Ai Qua Sông', 'Viết về người nông dân miền Tây Nam Bộ.', 2, 13, 3, 100000, 200, 1),
('Trưởng Thành Là Khi Nỗi Buồn Cũng Có Deadline', 'Ngày trước cứ nghĩ rằng lớn lên sẽ thích lắm, muốn làm gì cũng được, không ai quản. Đúng là như vậy, nhưng cái giá phải trả chính là sự cô đơn.
Ngày trước lúc còn vô tư, thơ ngây luôn mộng tưởng cuộc sống trải đầy hoa hồng nhưng những điều hoa mỹ đó đều được sách vở “mài giũa” một cách khéo léo.
Ngày trước có thể tuỳ hứng, thích thì làm không thích thì bỏ đi. Nhưng bây giờ, mệt cũng phải gắng gượng hoàn thành cho hết công việc, thất tình cũng không thể bỏ cả thế giới lại sau lưng.', 2, 14, 4, 88000, 200, 1),
('Ếch Ộp - Tuyển Tập Truyện Siêu Ngắn', '- “Người yêu cũ là gì?”
Là Vitamin A. Bởi vì các loại quả chứa Vitamin A đều giúp chúng ta sáng mắt ra.', 2, 15, 5, 89000, 200, 1),
('Sách Giáo Khoa Bộ Lớp 11 - Sách Bài Học (Bộ 14 Cuốn)', '', 3, 16, 1, 169000, 200, 1),
('Sách Giáo Khoa Bộ Lớp 12 - Sách Bài Học (Bộ 14 Cuốn)', '', 3, 16, 1, 180000, 200, 1);

insert into images values--(product_id, image_link) values
(1, 1, 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244835199.jpg'),
(2, 1, 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/tham_tu_lung_danh_conan___tap_96/2021_07_29_16_27_07_2-390x510.jpg'),
(3, 1, 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/tham_tu_lung_danh_conan___tap_96/2021_07_29_16_27_07_5-390x510.jpg'),
(1, 2, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_223783.jpg'),
(1, 3, 'https://cdn0.fahasa.com/media/catalog/product/d/o/doraemon-dai-tuyen-tap---truyen-ngan-tap-15.jpg'),
(1, 4, 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244865981.jpg'),
(1, 5, 'https://cdn0.fahasa.com/media/catalog/product/n/a/naruto---tap-61---tb-2022.jpg'),
(1, 6, 'https://cdn0.fahasa.com/media/catalog/product/d/r/dragon-ball-color---phan-5-_-truy-lung-cell-bo-hung---tap-1_1.jpg'),
(2, 6, 'https://cdn0.fahasa.com/media/catalog/product/t/r/truy_l_ng_cell_b_hung_-2.png'),
(3, 6, 'https://cdn0.fahasa.com/media/catalog/product/t/r/truy_l_ng_cell_b_hung_-1.png'),
(1, 7, 'https://cdn0.fahasa.com/media/catalog/product/c/h/chu_thuat_hoi_chien_-_tap_4_-_ta_se_diet_tru_nguoi_2.jpg'),
(2, 7, 'https://cdn0.fahasa.com/media/catalog/product/6/0/600chu-thuat-4-mockup-ban-thuong.jpg'),
(3, 7, 'https://cdn0.fahasa.com/media/catalog/product/c/h/chu_thuat_hoi_chien_-_tap_4_-_ta_se_diet_tru_nguoi_-_the_bo_goc.jpg'),
(1, 8, 'https://cdn0.fahasa.com/media/catalog/product/s/p/spy_-_family_-_tap_7_b_a_1__1.jpg'),
(1, 9, 'https://cdn0.fahasa.com/media/catalog/product/h/o/hoc-vien-sieu-anh-hung---tap-29---troi-day_1.jpg'),
(2, 9, 'https://cdn0.fahasa.com/media/catalog/product/h/o/hoc_vien_sieu_anh_hung_-_tap_29_-_troi_day_-_bookmark.jpg'),
(1, 10, 'https://cdn0.fahasa.com/media/catalog/product/d/r/dr.stone---tap-19---thanh-pho-ngo-1-trieu-dan.jpg'),
(1, 11, 'https://cdn0.fahasa.com/media/catalog/product/c/o/copy_21_nxbtrestoryfull_04112014_021101.jpg'),
(2, 11, 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/ut_quyen_va_toi_tai_ban_2019/2020_04_28_15_26_53_2-390x510.JPG'),
(3, 11, 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/ut_quyen_va_toi_tai_ban_2019/2020_04_28_15_26_53_12-390x510.JPG'),
(1, 12, 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_193731.jpg'),
(2, 12, 'https://cdn0.fahasa.com/media/catalog/product/c/h/chi_pheo_2017_10_2018_07_25_09_10_41.JPG'),
(1, 13, 'https://cdn0.fahasa.com/media/catalog/product/2/a/2a8ab322619f760d26b7ff0e2fa63f1f.jpg'),
(1, 14, 'https://cdn0.fahasa.com/media/catalog/product/t/r/truong-thanh-la-khi-noi-buon-cung-co-deadline-_ntv_-_1_.jpg'),
(2, 14, 'https://cdn0.fahasa.com/media/catalog/product/b/i/bia_truong-thanh-la-khi-noi-buon-cung-co-deadline-_ntv_-_2_.jpg'),
(1, 15, 'https://cdn0.fahasa.com/media/catalog/product/3/3/3300000015408-1.jpg'),
(1, 16, 'https://cdn0.fahasa.com/media/catalog/product/3/3/3300000015422-1.jpg');


insert into accounts(username, pwd, firstname, lastname, phone, address, ward, district, province, role_id, account_status) values
('admin', '12345678', 'Tên', 'Chủ shop', '0123456789', 'Không', 'Không', 'Không', 'Không', 1, 1),
('staff1', '12345678', 'Tên', 'Nhân viên 1', '0123456789', 'Không', 'Không', 'Không', 'Không', 2, 1),
('staff2', '12345678', 'Tên', 'Nhân viên 2', '0123456789', 'Không', 'Không', 'Không', 'Không', 2, 1),
('customer1', '12345678', 'Tên', 'Khách hàng 1', '0123456789', 'Không', 'Không', 'Không', 'Không', 3, 1),
('customer2', '12345678', 'Tên', 'Khách hàng 2', '0123456789', 'Không', 'Không', 'Không', 'Không', 3, 1);

insert into carts(account_id) values (4), (5);

insert into cart_content(cart_id, product_id, cart_quantity) values
(1, 1, 2), (1, 4, 1),
(2, 5, 2), (2, 8, 2);

insert into orders(account_id, order_total, order_time, order_phone, order_a, order_w, order_d, order_p, order_status) values
(4, 100000, '2022-05-26 16:00:00.0', '0123456789', 'Không', 'Không', 'Không', 'Không', 3),
(4, 100000, '2022-05-28 08:00:00.0', '0123456789', 'Không', 'Không', 'Không', 'Không', 0),
(5, 170000, '2022-05-25 15:00:00.0', '0123456789', 'Không', 'Không', 'Không', 'Không', 3),
(5, 30000, '2022-05-27 16:00:00.0', '0123456789', 'Không', 'Không', 'Không', 'Không', 1);

insert into order_content(order_id, product_id, order_price, order_quantity) values
(1, 2, 40000, 1), (1, 3, 60000, 1),
(2, 1, 20000, 1), (2, 4, 80000, 1),
(3, 5, 50000, 1), (3, 6, 120000, 1),
(4, 7, 10000, 1), (4, 8, 20000, 1);

insert into comments(product_id, account_id, comment_time, comment_body, comment_status) values
(2, 4, '2022-05-27 16:00:00.0', 'Truyện hay quá!', 1), (3, 4, '2022-05-27 16:05:00.0', 'Mong ra chương mới!', 1),
(6, 5, '2022-05-26 15:00:00.0', 'Sách này ảo thật đấy!', 1), (5, 5, '2022-05-26 15:05:00.0', 'Làm giàu không khó!', 1);