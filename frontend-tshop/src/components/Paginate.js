import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { ReactSmartScroller } from 'react-smart-scroller'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        <ReactSmartScroller
          thumb={
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: 'black',
              }}
            />
          }
        >
          {[...Array(pages).keys()].map((n) => (
            <LinkContainer
              key={n + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${n + 1}`
                    : `/page/${n + 1}`
                  : `/admin/productlist/${n + 1}`
              }
            >
              <Pagination.Item active={n + 1 === page}>{n + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </ReactSmartScroller>
      </Pagination>
    )
  )
}

export default Paginate
