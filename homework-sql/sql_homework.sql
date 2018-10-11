-- Define the database to be used --
use sakila;


-- 1a. Display the first and last names of all actors from the table actor.
select first_name, last_name
from actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
select concat(upper(first_name),' ',upper(last_name)) as 'Actor Name'
from actor;


-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
select actor_id, first_name, last_name
from actor
where first_name = 'Joe';

-- 2b. Find all actors whose last name contain the letters GEN:
select actor_id, first_name, last_name
from actor
where last_name like '%GEN%';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
select actor_id, first_name, last_name
from actor
where last_name like '%LI%'
order by last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
select country_id, country
from country
where country in ('Afghanistan', 'Bangladesh', 'China');


-- 3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
alter table actor
add column middle_name char(45) after first_name;

-- 3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
alter table actor
modify middle_name blob;

-- 3c. Now delete the middle_name column.
alter table actor
drop column middle_name;


-- 4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(*) as actors
from actor
group by last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
select *
from (
	select last_name, count(*) as actors
	from actor
	group by last_name
) as grouped_actors
where actors > 1
order by actors desc;

-- 4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
-- Check the actor_id first
select *
from actor
where first_name = 'GROUCHO' and last_name = 'WILLIAMS';

update actor
set first_name = 'HARPO'
where actor_id = 172;

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
update actor
set first_name = (case when first_name = 'HARPO' then 'GROUCHO' else 'MUCHO GROUCHO' end)
where actor_id = 172;


-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
show create table address;


-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select a.first_name, a.last_name, b.address
from staff as a left join address as b
on a.address_id = b.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
select a.first_name, a.last_name, b.total_amount
from staff as a left join (
	select staff_id, sum(amount) as total_amount 
    from payment
    where month(payment_date) = 8 and year(payment_date) = 2005
    group by staff_id
) as b
on a.staff_id = b.staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
select a.title, b.total_actors
from film as a inner join (
	select film_id, count(*) as total_actors 
    from film_actor
    group by film_id
) as b
on a.film_id = b.film_id;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select film_id, count(*) as total_copies
from inventory
where film_id in (
	select film_id
    from film
    where title = 'Hunchback Impossible'
)
group by film_id;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
select a.first_name, a.last_name, b.total_paid
from customer as a left join (
	select customer_id, sum(amount) as total_paid 
    from payment
    group by customer_id
) as b
on a.customer_id = b.customer_id
order by a.last_name;


-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
select title
from film
where (title like 'K%' or title like 'Q%') and language_id in (
	select language_id
    from language
    where name = 'English'
);

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
select first_name, last_name
from actor
where actor_id in (
	select actor_id
	from film_actor
	where film_id in (
		select film_id
		from film
		where title = 'Alone Trip'
	)
);

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
select a.first_name, a.last_name, a.email
from customer as a inner join (
select address_id
	from address
	where city_id in (
		select city_id
		from city
		where country_id in (
			select country_id
			from country
			where country = 'Canada'
		)
	)
) as b
on a.address_id = b.address_id;

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
select film_id, title
from film
where film_id in (
	select film_id
	from film_category
	where category_id in (
		select category_id
		from category
		where name = 'Family'
	)
);

-- 7e. Display the most frequently rented movies in descending order.
select a.film_id, c.title, count(*) as total_rentals
from inventory as a left join rental as b
on a.inventory_id = b.inventory_id
left join film as c
on a.film_id = c.film_id
group by a.film_id
order by total_rentals desc;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
select a.store_id, sum(c.amount) as total_amount
from inventory as a left join rental as b
on a.inventory_id = b.inventory_id
left join payment as c
on b.rental_id = c.rental_id
group by a.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
select a.store_id, c.city, d.country
from store as a left join address as b
on a.address_id = b.address_id
left join city as c
on b.city_id = c.city_id
left join country as d
on c.country_id = d.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select a.name as category, sum(e.amount) as total_amount
from category as a left join film_category as b
on a.category_id = b.category_id
left join inventory as c
on b.film_id = c.film_id
left join rental as d
on c.inventory_id = d.inventory_id
left join payment as e
on d.rental_id = e.rental_id
group by a.name
order by total_amount desc
limit 5;


-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
create view top_five_genres as
select a.name as category, sum(e.amount) as total_amount
from category as a left join film_category as b
on a.category_id = b.category_id
left join inventory as c
on b.film_id = c.film_id
left join rental as d
on c.inventory_id = d.inventory_id
left join payment as e
on d.rental_id = e.rental_id
group by a.name
order by total_amount desc
limit 5;

-- 8b. How would you display the view that you created in 8a?
select * from top_five_genres;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
drop view top_five_genres;