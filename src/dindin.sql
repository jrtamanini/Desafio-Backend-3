-- criação do banco de dados - DINDIN -;


create database dindin;

create table usuarios (
	id serial primary key,
  nome text not null,
  email text unique,
  senha text
);

create table categorias (
	id serial primary key,
  usuarios_id integer references usuarios(id),
  descricao text not null
);

create table transacoes (
	id serial primary key,
  descricao text not null,
  valor integer, 
  data timestamp default now(),
  categoria_id integer references categorias(id),
  usuario_id integer references usuarios(id),
  tipo text not null
);

