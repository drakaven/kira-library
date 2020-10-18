import React, {useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';

import { Button, Container, Row, ListGroup, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const BASE_URL = 'http://localhost:8000/api/'
const ITEMS_PER_PAGE = 5

function App() {
  /**
   * Hooks based component for our Library. The idea is to simply refetch data
   * when things change. No redux or apollo cache / state management. Features
   * are built around the Django setup for search, filtering, and pagination.
   * Error handling also didn't make it in.
   */

  // Setting up state for response data, search and filter.
  const [data, setData] = useState({
    count: 0,
    next: null,
    prev: null,
    responseUrl: null,
    page: 1,
    data:[] });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const defaultUrl = `${BASE_URL}books/`
  const defaultParams = {
        params: {
          // Tiernary prevents empty params from cluttering url
          search: search === "" ? null : search,
          'reservations__isnull': filter === "" ? null : filter
        }
  }

  const getPageNumber = (responseUrl) => {
    const matches = responseUrl.match(/[?,&]page=(\d*)/)
    return matches ? Number(matches[1]) : 1
  }

  const getAndSetData = useCallback( async (url, config=undefined) => {
  /**
   * This function does most of the heavy lifting for the App. Fetches the data
   * and updates the state.
   */

    const response = await Axios.get(url, config)

    setData({
      count: response.data.count,
      data: response.data.results,
      next: response.data.next,
      previous: response.data.previous,
      page: getPageNumber(response.request.responseURL),
      responseUrl: response.request.responseURL,
    })
  }, [])

  useEffect( () => {
    /**
     * Fetches data on mount and when search or filter changes.
     */

    // useEffect doesn't allow promises to be returned so we need an async wrapper.
    const wrapper = async () => {
      await getAndSetData(defaultUrl, defaultParams)
    }
      wrapper()
    }, [search, filter, getAndSetData]
  )

  return (
    <Container className="App">
      <h1>Saasvile Public Library</h1>
      <p><em>We put the sass in Saas!</em></p>
      <Form.Group>
        <Form.Label>Search</Form.Label>
        <Form.Control
        type="text"
        placeholder="search by title"
        value={search}
        onChange={e => {
          e.preventDefault()
          setSearch(e.target.value)}}
      />
      </Form.Group>
      <Form.Group>
      <Form.Label>Reserved Status</Form.Label>
      <Form.Control
        as="select"
        onChange={e => {
          e.preventDefault()
          setFilter(e.target.value)}}
      >
        <option value="">All</option>
        <option value="false">Reserved</option>
        <option value="true">Unreserved</option>
      </Form.Control>
      </Form.Group>
      <span>Results: {data.count}</span>
      <ListGroup>
        { data.data.map(item => {
          // Render books and reservation buttons.
          // Todo make seperate component
          return (
            <ListGroup.Item key={item.id}>
            <Row>
            <h6>{item.title}</h6>
            </Row>
            <Row>
            <p>by: {item.author}</p>
            </Row>
            <Row>
              <Col>Available: {item.quantity_available} </Col>
              <Col>Reservations: {item.reservations.length} </Col>
              <Col>Total Copies: {item.quantity} </Col>
            </Row>
            <div className="Reserve-Buttons">
              <Button
              variant="success"
              size="sm"
              disabled={item.quantity_available === 0}
              // Create a reservation for the related book.
              onClick={async () => {
                await Axios.post(
                  `${BASE_URL}reservations/`,
                  {book: item.id}
                )
                getAndSetData(data.responseUrl)
              }}
            >
              Reserve
            </Button>
            <Button
              variant="warning"
              size="sm"
              disabled={item.reservations.length === 0}
              // Simply delete the first reservation in the list.
              onClick={async () => {
                await Axios.delete(
                `${BASE_URL}reservations/${item.reservations[0]}/`,
              )
              getAndSetData(data.responseUrl)
              }}
            >
              Cancel Reservation
            </Button>
            </div>
          </ListGroup.Item>)
        })}
      </ListGroup>
      <footer>
        <Button
            variant="secondary"
            size="sm"
            disabled={data.previous === null}
            onClick={() => getAndSetData(data.previous)}
          >Prev</Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={data.next === null}
            onClick={() => getAndSetData(data.next)}
          >Next</Button>
        <p>Page: {data.page} of {Math.ceil(data.count / ITEMS_PER_PAGE)}</p>
      </footer>
    </Container>
  );
}

export default App;
