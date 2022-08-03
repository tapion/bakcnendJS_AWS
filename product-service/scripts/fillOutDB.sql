create table products(
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer
); 


create table stocks(
	product_id uuid not null primary key,
	count integer,
	foreign key (product_id) references products(id)
);


insert into products(id, title, description, price) values('680ca5d5-aadc-4d10-b833-eb60701c185c','Rice', 'White Rice', 2);
insert into products(id,title, description, price) values('64c68df9-ec33-4111-a2fd-dbd1dc8dd411','Avocato', 'Colombian Avocato', 5);
insert into products(id,title, description, price) values('b5437b4f-fadb-4c66-a363-4c10a5c58dfd','Beans', 'Green beans', 1);
insert into products(id,title, description, price) values('bdf37fe9-0f05-4113-b582-133c471b1c73','Ajiaco', 'Colombian soup', 10);

insert into stocks (product_id, count) values ('680ca5d5-aadc-4d10-b833-eb60701c185c',10000);
insert into stocks (product_id, count) values ('64c68df9-ec33-4111-a2fd-dbd1dc8dd411',350);
insert into stocks (product_id, count) values ('b5437b4f-fadb-4c66-a363-4c10a5c58dfd',1235);
insert into stocks (product_id, count) values ('bdf37fe9-0f05-4113-b582-133c471b1c73',1);
