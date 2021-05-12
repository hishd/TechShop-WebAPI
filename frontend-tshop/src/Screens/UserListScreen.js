import React, { useEffect } from 'react'
import {} from 'react-router-bootstrap'
import { Table, Button as BootStapButton } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { deleteUser, listUsers } from '../actions/userActions'
import { useConfirm } from 'material-ui-confirm'

const UserListScreen = ({ history }) => {
  const confirm = useConfirm()
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  // eslint-disable-next-line
  const { success: successDelete, error: errorDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, successDelete])

  const deleteHandler = (id) => {
    confirm({ description: `Are you sure you want to delete this user?` })
      .then(() => {
        dispatch(deleteUser(id))
      })
      .catch(() => console.log('Deletion cancelled.'))
  }

  return (
    <>
      <h1>Application Users </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user._id !== userInfo._id && (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <i
                          className='fas fa-check'
                          style={{ color: 'green' }}
                        ></i>
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{ color: 'red' }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {/* <LinkContainer to={`/user/${user._id}/edit`}>
                        <BootStapButton variant='dark' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </BootStapButton>
                      </LinkContainer> */}
                      <BootStapButton
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </BootStapButton>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
