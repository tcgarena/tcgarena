import React from 'react'

const Search = () => {
  return (
    <div id="main-navbar-search">
      <form id="search-form">
        <div className="search">
          <input
            type="text"
            name="search"
            className="round"
            placeholder="Search..."
          />
          <input type="submit" className="corner" value="" />
        </div>
      </form>
    </div>
  )
}

export default Search
