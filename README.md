# kira-library
Kira Django / React Library

This application is based on Django and React. The difficulty of the design exercise here really comes down to the question "How do I keep it simple and what do I omit, so that it is clear that the omission is a choice not incompetence?" Or at the very least a little of both ;)

So the decision was made implement a simple DRF backend with only two models Book and Reservation in a SQLite DB. Lucky had mentioned no inventory so the quantity remained a field on the book itself. The React frontend is also meant to be simple and leverage the strenght of the library. The choice was made to forgo any complex state management or caching via things like Redux or Apollo and just refetch everything on change. Even for things like updating a specific book after a reservation is created we just fetch the set instead of the specific book and save mutating state and just refresh it.

## Installation ##
Requires: Python 3.6+, Pip, (virtualenv recommended), Node, NPM

1. Clone the Repo

**Setup the Backend** 
1. Goto django_back/kira: `cd kira-library/django_backend/kira`
2. Setup virtualenv: `python3 -m venv env`
3. Activate virtualenv: `source ./env/bin/activate`
4. Install Dependancies: `pip install -r requirements.txt`
5. Start the server: `python manage.py runserver`

Development server should start at `127.0.0.1:8000`

**Setup the Frontend**
1. In a new terminal Goto react_frontend: `cd kira-library/react_frontend`
2. Install Dependancies: npm install
3. Start the server: npm start

Development server should start at `127.0.0.1:3000`

A browser should open a load the page. If not open a browser and goto `127.0.0.1:3000`


Below are the requirements and how they have been satified.

**Requirements:**
* List all books in inventory (paginated): GET api/books, default pagination set to 5, Done by loading page.
* Allow searching of books by title: search param, GET `api/books?search=Python`, Done by typing in the search box.
* Allow reservation of books: POST `api/reserveation {book: 1}`, creates a Reservation with realted Book, Done by clicking Reserve on a book.
* View books currently reserved: filter param, GET `api/books?relations__isnull=False`, Done by selecting a filter option.

### How to use the app
There is a search bar at the top of the page to search by title. (fires on change)
A filter select that filters by all books, books that have at least one reservation, and books that have not reservations.

Filter and Search work together and the results count is show about the list.

The results list, lists a books matching the search and filter. Each book shows the Title, Author, Available, Number of Reservations and Total Quantity.

As well each book has `reserve` and `cancel reservation` buttons. If there are no reservations `cancel reservation` is disabled, no books available `reserve` is disabled.

Finally at the bottom. Prev and Next paginaton buttons each will also disable if the option is unavialable.

### Summary
In Summary the goal here was just to keep things simple and clear, hit all the requirements and add a bit of extra visual information and validation.

Thanks so much for your time let me know if you have any questions!

