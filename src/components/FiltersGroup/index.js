import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {onSearchText, onEnterSearch, clearFilter} = props

  const onChangingInput = event => {
    onSearchText(event.target.value)
  }

  const onEnter = event => {
    if (event.key === 'Enter') {
      onEnterSearch()
    }
  }

  const onClearFilter = () => {
    clearFilter()
  }

  const renderInputElement = () => {
    const {titleSearch} = props

    return (
      <div className="input-container">
        <input
          type="search"
          className="input-element"
          placeholder="Search"
          value={titleSearch}
          onChange={onChangingInput}
          onKeyDown={onEnter}
        />
        <BsSearch className="search-icon" />
      </div>
    )
  }

  const renderCategoryElements = () => {
    const {categoryOptions} = props

    return (
      <div>
        <h1>Category</h1>
        {categoryOptions.map(category => {
          const {changeCategory, activeCategoryId} = props
          const onClickCategoryItem = () => changeCategory(category.categoryId)
          const isActive = category.categoryId === activeCategoryId
          const categoryClassName = isActive
            ? `category-name active-category-name`
            : `category-name`

          return (
            <li
              className="category-li-item"
              onClick={onClickCategoryItem}
              key={category.categoryId}
            >
              <p className={categoryClassName}>{category.name}</p>
            </li>
          )
        })}
      </div>
    )
  }

  const renderRatingElements = () => {
    const {ratingsList} = props

    return (
      <ul>
        <h1>Rating</h1>
        {ratingsList.map(eachRating => {
          const {ratingClicked} = props

          const onClickingRating = () => {
            ratingClicked(eachRating.ratingId)
          }
          return (
            <li className="rating-li-item" onClick={onClickingRating}>
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="rating-image"
              />
              <p>%up</p>
            </li>
          )
        })}
        <button
          type="button"
          className="clear-filter-btn"
          onClick={onClearFilter}
        >
          Clear Filters
        </button>
      </ul>
    )
  }

  return (
    <div className="filters-group-container">
      {renderInputElement()}
      {renderCategoryElements()}
      {renderRatingElements()}
    </div>
  )
}

export default FiltersGroup
