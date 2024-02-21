import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const activeStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeStatus: activeStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    categoryId: '',
    ratingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      activeStatus: activeStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, categoryId, titleSearch, ratingId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${titleSearch}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        activeStatus: activeStatusConstants.success,
      })
    } else {
      this.setState({activeStatus: activeStatusConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    const showProductsList = productsList.length > 0

    // TODO: Add No Products View

    return showProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="no-products"
        />
        <h1>No Products Found</h1>
        <p>We could not find any products. Try other filters.</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  getAllProducts = () => {
    const {activeStatus} = this.state

    switch (activeStatus) {
      case activeStatusConstants.success:
        return this.renderProductsList()
      case activeStatusConstants.inProgress:
        return this.renderLoader()
      case activeStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  onSearchText = titleSearch => {
    this.setState({titleSearch})
  }

  onEnterSearch = () => {
    this.getProducts()
  }

  clearFilter = () => {
    this.setState(
      {categoryId: '', ratingId: '', titleSearch: ''},
      this.getProducts,
    )
  }

  changeCategory = categoryId => {
    this.setState({categoryId}, this.getProducts)
  }

  ratingClicked = ratingId => {
    this.setState({ratingId}, this.getProducts)
  }

  render() {
    const {titleSearch, categoryId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          titleSearch={titleSearch}
          onSearchText={this.onSearchText}
          onEnterSearch={this.onEnterSearch}
          clearFilter={this.clearFilter}
          changeCategory={this.changeCategory}
          activeCategoryId={categoryId}
          ratingClicked={this.ratingClicked}
        />
        {this.getAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
